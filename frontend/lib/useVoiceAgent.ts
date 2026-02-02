'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from './api';

interface Voice {
  name: string;
  language_code: string;
  ssml_gender: string;
  natural_sample_rate_hertz: number;
}

interface UseVoiceAgentOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string | null;
}

export function useVoiceAgent(options: UseVoiceAgentOptions = {}) {
  const {
    enabled = true,
    rate = 1.0,
    pitch = 0.0, // Google Cloud TTS pitch is -20.0 to 20.0, default 0.0
    volume = 1.0,
    voiceName = null,
  } = options;

  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(voiceName);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);

  // Load enabled preference and voice preference from localStorage after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('trivia-voice-enabled');
      if (savedEnabled === 'false') {
        setTimeout(() => {
          setIsEnabled(false);
        }, 0);
      }
      
      const savedVoiceName = localStorage.getItem('trivia-voice-name');
      if (savedVoiceName) {
        setTimeout(() => {
          setSelectedVoiceName(savedVoiceName);
        }, 0);
      }
    }
  }, []);

  // Load available voices from Google Cloud TTS
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await api.listVoices('en-US');
        setAvailableVoices(voices);
        
        // Check if we have a saved voice preference
        const savedVoiceName = localStorage.getItem('trivia-voice-name');
        if (savedVoiceName && voices.some(v => v.name === savedVoiceName)) {
          setSelectedVoiceName(savedVoiceName);
          return;
        }
        
        // Auto-select a good default voice (prefer female, neural voices)
        if (!selectedVoiceName && voices.length > 0) {
          const preferredVoice = voices.find(
            v => v.ssml_gender === 'FEMALE' && v.name.includes('Neural')
          ) || voices.find(v => v.ssml_gender === 'FEMALE') || voices[0];
          
          if (preferredVoice) {
            setSelectedVoiceName(preferredVoice.name);
          }
        }
      } catch (error) {
        console.error('Failed to load voices:', error);
        // Fallback: use empty array, will fall back to default voice
        setAvailableVoices([]);
      }
    };

    loadVoices();
  }, [selectedVoiceName]);

  // Save enabled preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trivia-voice-enabled', String(isEnabled));
    }
  }, [isEnabled]);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
        currentAudioUrlRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
    // Also stop browser TTS if it's running
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Fallback to browser's Web Speech API
  const fallbackToBrowserTTS = useCallback((text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.error('Browser TTS not available');
      setIsSpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate ?? rate;
      utterance.pitch = options?.pitch ?? (pitch / 20); // Convert from -20-20 to -1-1 range
      utterance.volume = options?.volume ?? volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        console.error('Browser TTS also failed');
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error with browser TTS:', error);
      setIsSpeaking(false);
    }
  }, [rate, pitch, volume]);

  const speak = useCallback(async (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string | null;
  }) => {
    if (!isEnabled || !text.trim()) {
      return;
    }

    // Stop any ongoing speech
    stop();

    // Try Google Cloud TTS first, fallback to browser TTS if it fails
    try {
      // Get audio URL from Google Cloud TTS API
      let audioUrl: string;
      try {
        audioUrl = await api.textToSpeech(text, {
          languageCode: 'en-US',
          voiceName: options?.voiceName || selectedVoiceName || undefined,
          speakingRate: options?.rate ?? rate,
          pitch: options?.pitch ?? pitch,
        });
      } catch (apiError: unknown) {
        // If Google Cloud TTS is not configured (503), use browser TTS immediately
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        if (errorMessage.includes('503') || errorMessage.includes('not configured')) {
          console.info('Google Cloud TTS not available, using browser TTS');
          fallbackToBrowserTTS(text, options);
          return;
        }
        throw apiError; // Re-throw other errors
      }

      // Clean up previous audio URL if exists
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }

      currentAudioUrlRef.current = audioUrl;

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.volume = options?.volume ?? volume;
      audio.preload = 'auto';

      audio.onplay = () => {
        setIsSpeaking(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        // Clean up audio URL after playback
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
          currentAudioUrlRef.current = null;
        }
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        // Clean up
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
          currentAudioUrlRef.current = null;
        }
        audioRef.current = null;
        // Fallback to browser TTS
        fallbackToBrowserTTS(text, options);
      };

      // Try to play audio
      try {
        // Wait for audio to be ready, then play
        if (audio.readyState >= 2) {
          await audio.play();
        } else {
          // Wait for canplay event
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
            audio.oncanplay = () => {
              clearTimeout(timeout);
              resolve();
            };
            audio.onerror = () => {
              clearTimeout(timeout);
              reject(new Error('Audio error'));
            };
          });
          await audio.play();
        }
      } catch {
        // If autoplay is blocked or other error, fallback to browser TTS
        fallbackToBrowserTTS(text, options);
      }
    } catch (error) {
      console.warn('Google Cloud TTS failed, falling back to browser TTS:', error);
      // Fallback to browser TTS
      fallbackToBrowserTTS(text, options);
    }
  }, [isEnabled, rate, pitch, volume, selectedVoiceName, stop, fallbackToBrowserTTS]);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => {
      if (prev) {
        stop();
      }
      return !prev;
    });
  }, [stop]);

  const setVoice = useCallback((voice: Voice | null) => {
    const voiceName = voice?.name || null;
    setSelectedVoiceName(voiceName);
    // Save voice preference to localStorage
    if (typeof window !== 'undefined' && voiceName) {
      localStorage.setItem('trivia-voice-name', voiceName);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('trivia-voice-name');
    }
  }, []);

  const selectedVoice = availableVoices.find(v => v.name === selectedVoiceName) || null;

  return {
    isEnabled,
    isSpeaking,
    availableVoices,
    selectedVoice,
    speak,
    stop,
    toggleEnabled,
    setVoice,
  };
}
