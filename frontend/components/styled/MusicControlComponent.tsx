import styled from 'styled-components';
import { colors, typography } from './theme';

export const MusicControlContainer = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
`;

export const MusicButton = styled.button<{ $isMuted: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: 2px solid ${colors.surface};
  background-color: ${colors.accent};
  opacity: 0.9;
  color: ${colors.surface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.displaylg};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;

  &:hover {
    background-color: ${colors.typeAccent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Add slash effect when muted */
  ${props => props.$isMuted && `
    &::after {
      content: '';
      position: absolute;
      width: 2.5rem;
      height: 2px;
      background-color: ${colors.red[500]};
      transform: rotate(-45deg);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    }
  `}
`;

export const Tooltip = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: ${colors.typeMain};
  color: ${colors.surface};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-family: ${typography.presets.bodySmall.fontFamily};
  font-size: ${typography.presets.bodySmall.fontSize};
  font-weight: ${typography.presets.bodySmall.fontWeight};
  line-height: ${typography.presets.bodySmall.lineHeight};
  white-space: nowrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  opacity: ${props => props.$show ? 0.9 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
  z-index: 1001;

  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 1.5rem;
    border: 0.5rem solid transparent;
    border-bottom-color: ${colors.typeMain};
    opacity: 0.9;
  }
`;

export const TooltipText = styled.div`
  text-align: left;
`;

export const TooltipLine = styled.div`
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TooltipLink = styled.a`
  color: ${colors.blue[400]};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const VoiceControlContainer = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 5.5rem;
  z-index: 1000;
`;

export const VoiceButton = styled.button<{ $isMuted: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: 2px solid ${colors.surface};
  background-color: ${colors.accent};
  opacity: 0.9;
  color: ${colors.surface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.displaylg};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;

  &:hover {
    background-color: ${colors.typeAccent};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Add slash effect when disabled */
  ${props => props.$isMuted && `
    &::after {
      content: '';
      position: absolute;
      width: 2.5rem;
      height: 2px;
      background-color: ${colors.red[500]};
      transform: rotate(-45deg);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    }
  `}
`;

export const VoiceMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: ${colors.typeMain};
  color: ${colors.surface};
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1002;
  pointer-events: auto;
`;

export const VoiceMenuHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${colors.border};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.sm};
  color: ${colors.surface};
  position: sticky;
  top: 0;
  background-color: ${colors.typeMain};
  z-index: 1;
`;

export const VoiceMenuItem = styled.div<{ $selected: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  transition: background-color 0.2s ease;
  background-color: ${props => props.$selected ? colors.accent : 'transparent'};
  color: ${colors.surface};

  &:hover {
    background-color: ${props => props.$selected ? colors.accent : colors.typeAccent};
  }

  &:first-of-type {
    border-top: none;
  }
`;
