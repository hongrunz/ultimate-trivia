'use client';

import { useState, useRef, useEffect } from 'react';
import { VoiceControlContainer, VoiceButton, Tooltip, TooltipText, TooltipLine, VoiceMenu, VoiceMenuItem, VoiceMenuHeader } from './styled/MusicControlComponent';

// Google Cloud TTS Voice type
type Voice = {
  name: string;
  language_code: string;
  ssml_gender: string;
  natural_sample_rate_hertz: number;
};

interface VoiceControlProps {
  isEnabled: boolean;
  onToggle: () => void;
  availableVoices: Voice[];
  selectedVoice: Voice | null;
  onVoiceSelect: (voice: Voice) => void;
  disabled?: boolean;
}

export default function VoiceControl({ 
  isEnabled, 
  onToggle, 
  availableVoices,
  selectedVoice,
  onVoiceSelect,
  disabled = false 
}: VoiceControlProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Filter English voices for easier selection
  const englishVoices = availableVoices.filter(v => v.language_code.startsWith('en'));
  const displayVoices = englishVoices.length > 0 ? englishVoices : availableVoices;

  const handleVoiceSelect = (voice: Voice) => {
    onVoiceSelect(voice);
    setShowMenu(false);
  };

  return (
    <VoiceControlContainer
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => !showMenu && setShowTooltip(false)}
      ref={menuRef}
    >
      <VoiceButton
        onClick={onToggle}
        disabled={disabled}
        $isMuted={!isEnabled}
        aria-label={isEnabled ? 'Disable voice agent' : 'Enable voice agent'}
        onContextMenu={(e) => {
          e.preventDefault();
          if (isEnabled && availableVoices.length > 0) {
            setShowMenu(!showMenu);
          }
        }}
      >
        🔊
      </VoiceButton>
      <Tooltip $show={showTooltip && !showMenu}>
        <TooltipText>
          <TooltipLine><strong>Voice Agent:</strong> {isEnabled ? 'Enabled' : 'Disabled'}</TooltipLine>
          <TooltipLine>Host announcements and question narration</TooltipLine>
          {isEnabled && availableVoices.length > 0 && (
            <TooltipLine style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
              Right-click to change voice
            </TooltipLine>
          )}
        </TooltipText>
      </Tooltip>
      {showMenu && isEnabled && (
        <VoiceMenu>
          <VoiceMenuHeader>Select Voice</VoiceMenuHeader>
          {displayVoices.map((voice) => (
            <VoiceMenuItem
              key={voice.name}
              $selected={selectedVoice?.name === voice.name}
              onClick={() => handleVoiceSelect(voice)}
            >
              {voice.name.replace('en-US-', '').replace('-', ' ')} ({voice.ssml_gender})
            </VoiceMenuItem>
          ))}
        </VoiceMenu>
      )}
    </VoiceControlContainer>
  );
}
