import styled from 'styled-components';

// Info box for device mode notices
export const InfoBox = styled.div<{ $variant?: 'web' | 'mobile' }>`
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: ${props => props.$variant === 'web' ? '#dbeafe' : '#fef3c7'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
`;

// Big screen mode notice (larger, with border)
export const BigScreenNotice = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #dbeafe;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1f2937;
  border: 2px solid #3b82f6;
`;

// Highlighted warning text within notices
export const WarningText = styled.span`
  color: #dc2626;
  font-weight: bold;
`;
