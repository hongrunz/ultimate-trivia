'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to play an audio file once when the component mounts.
 * Similar to useBackgroundMusic but plays only once.
 */
export function usePlayAudio(
  audioUrl: string,
  options: {
    volume?: number;
    autoPlay?: boolean;
  } = {}
) {
  const {
    volume = 0.8,
    autoPlay = true,
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // If we already have an audio instance playing, don't create another one
    if (audioInstanceRef.current && !audioInstanceRef.current.paused) {
      return;
    }

    // Only mark as played once audio actually starts playing
    if (hasPlayedRef.current && audioInstanceRef.current) {
      return;
    }

    // Create audio element
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;
    audioInstanceRef.current = audio;

    let isCleanedUp = false;
    let hasStartedPlaying = false;

    // Try to play immediately if already loaded
    const tryPlay = () => {
      if (isCleanedUp || hasStartedPlaying) {
        return;
      }
      if (autoPlay) {
        audio.play()
          .then(() => {
            hasStartedPlaying = true;
            hasPlayedRef.current = true;
          })
          .catch(() => {
            // Auto-play prevented by browser - that's okay
          });
      }
    };

    // Play when ready
    const handleCanPlay = () => {
      if (isCleanedUp) return;
      tryPlay();
    };

    const handleLoadedData = () => {
      if (isCleanedUp) return;
      if (audio.readyState >= 2) {
        tryPlay();
      }
    };

    const handleError = () => {
      // Silently handle errors
    };

    // Try playing immediately if ready
    if (audio.readyState >= 2) { // HAVE_CURRENT_DATA
      tryPlay();
    } else {
      audio.addEventListener('canplay', handleCanPlay, { once: true });
      audio.addEventListener('loadeddata', handleLoadedData, { once: true });
      audio.addEventListener('error', handleError);
    }

    // Cleanup - only clean up if component unmounts, not on re-render
    return () => {
      isCleanedUp = true;
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      // Don't pause/clear if audio is playing - let it finish
      // Only clean up if it hasn't started playing yet
      if (audio.paused && !hasStartedPlaying) {
        audio.pause();
        audio.src = '';
        audioInstanceRef.current = null;
      }
    };
  }, [audioUrl, volume, autoPlay]);
}
