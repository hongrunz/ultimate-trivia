import styled from 'styled-components';
import { typography } from './theme';

// Error message components
export const ErrorBox = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  border: 2px solid #dc2626;
`;

export const ErrorIcon = styled.div`
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.display3xl};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  margin-bottom: 1rem;
`;

export const ErrorHeading = styled.div`
  font-family: ${typography.presets.h2.fontFamily};
  font-size: ${typography.fontSize.displaysm};
  font-weight: ${typography.fontWeight.bold};
  line-height: ${typography.presets.h2.lineHeight};
  color: #dc2626;
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.div`
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  color: #1f2937;
  margin-top: 0.5rem;
`;

// Simple error text (for inline error messages)
export const ErrorText = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  font-family: ${typography.presets.bodySmall.fontFamily};
  font-size: ${typography.presets.bodySmall.fontSize};
  font-weight: ${typography.presets.bodySmall.fontWeight};
  line-height: ${typography.presets.bodySmall.lineHeight};
  text-align: center;
`;
