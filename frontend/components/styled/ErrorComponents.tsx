import styled from 'styled-components';

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
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const ErrorHeading = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #dc2626;
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.div`
  font-size: 0.95rem;
  color: #1f2937;
  margin-top: 0.5rem;
`;

// Simple error text (for inline error messages)
export const ErrorText = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;
