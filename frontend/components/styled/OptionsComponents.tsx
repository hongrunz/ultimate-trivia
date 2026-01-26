import styled from 'styled-components';
import { colors, typography } from './theme';

export const OptionsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const OptionButton = styled.button`
  width: 100%;
  padding: 0.75rem 0.75rem;
  border: 1px solid ${colors.border};
  border-radius: 0.375rem;
  background-color: ${colors.surface};
  color: ${colors.typeMain};
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  line-height: ${typography.lineHeight.normal};
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.05s ease;

  &:hover:not(:disabled) {
    background-color: ${colors.surfaceSecondary};
    border-color: ${colors.border};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px ${colors.surfaceSecondary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

