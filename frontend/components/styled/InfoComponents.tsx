import styled from 'styled-components';
import { colors, typography } from './theme';

// Info box for device mode notices
export const InfoBox = styled.div<{ $variant?: 'web' | 'mobile' }>`
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: ${props => props.$variant === 'web' ? colors.surfaceSecondary : colors.surfaceSecondary};
  border-radius: 0.5rem;
  font-family: ${typography.presets.bodySmall.fontFamily};
  font-size: ${typography.presets.bodySmall.fontSize};
  font-weight: ${typography.presets.bodySmall.fontWeight};
  line-height: ${typography.presets.bodySmall.lineHeight};
  color: ${colors.typeMain};
`;

// Big screen mode notice (larger, with border)
export const BigScreenNotice = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${colors.surfaceSecondary};
  border-radius: 0.5rem;
  font-family: ${typography.presets.body.fontFamily};
  font-size: ${typography.presets.body.fontSize};
  font-weight: ${typography.presets.body.fontWeight};
  line-height: ${typography.presets.body.lineHeight};
  color: ${colors.typeMain};
  
`;

// Highlighted warning text within notices
export const WarningText = styled.span`
  color: #dc2626;
  font-weight: ${typography.fontWeight.bold};
`;
