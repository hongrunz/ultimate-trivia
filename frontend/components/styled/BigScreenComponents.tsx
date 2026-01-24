import styled from 'styled-components';
import {
  LeaderboardSection,
  LeaderboardHeading,
  LeaderboardItem,
} from './GameComponents';

// Styled components for big screen (scaled up version of mobile styles)
export const BigScreenCard = styled.div`
  background-color: #e5e7eb;
  width: 100%;
  max-width: 90rem;
  padding: 4rem;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 600px;

  @media (max-width: 1024px) {
    max-width: 60rem;
    padding: 3rem;
  }

  @media (max-width: 768px) {
    max-width: 28rem;
    padding: 2rem;
  }
`;

export const BigScreenHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
`;

export const BigScreenBadge = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2rem;
  color: #000000;

  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
`;

export const BigScreenQuestionText = styled.p`
  font-size: 3rem;
  color: #000000;
  margin-bottom: 3rem;
  text-align: center;
  line-height: 1.3;
  font-weight: 600;

  @media (max-width: 1024px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const BigScreenOptionsContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 0 0 3rem 0;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin: 0 0 1.5rem 0;
  }
`;

export const BigScreenOptionBox = styled.div<{ $isCorrect?: boolean; $showAnswer?: boolean }>`
  width: 100%;
  padding: 2.5rem;
  border: 2px solid #9ca3af;
  border-radius: 0.5rem;
  background-color: ${props => 
    props.$showAnswer && props.$isCorrect ? '#10b981' : '#ffffff'};
  color: ${props => 
    props.$showAnswer && props.$isCorrect ? '#ffffff' : '#111827'};
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 1.5rem;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

export const BigScreenExplanation = styled.div`
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #000000;
  border: 1px solid #9ca3af;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

export const BigScreenLeaderboardSection = styled(LeaderboardSection)`
  margin-top: 2rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #9ca3af;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const BigScreenLeaderboardHeading = styled(LeaderboardHeading)`
  font-size: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

export const BigScreenLeaderboardItem = styled(LeaderboardItem)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

// Error title with red color
export const ErrorTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #ef4444;
  text-align: center;
  margin: 0 0 2rem 0;
`;
