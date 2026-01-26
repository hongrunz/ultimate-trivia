import styled from 'styled-components';
import {
  LeaderboardSection,
  LeaderboardHeading,
  LeaderboardItem,
} from './GameComponents';
import { colors, typography } from './theme';

// Styled components for big screen (scaled up version of mobile styles)
export const BigScreenCard = styled.div`
  background-color: ${colors.surface};
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
  background-color: ${colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.presets.bigScreenBadge.fontFamily};
  font-weight: ${typography.presets.bigScreenBadge.fontWeight};
  font-size: ${typography.presets.bigScreenBadge.fontSize};
  line-height: ${typography.presets.bigScreenBadge.lineHeight};
  color: ${colors.typeMain};

  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    font-size: ${typography.fontSize.base};
  }
`;

export const BigScreenQuestionText = styled.p`
  font-family: ${typography.presets.bigScreenQuestion.fontFamily};
  font-size: ${typography.presets.bigScreenQuestion.fontSize};
  font-weight: ${typography.presets.bigScreenQuestion.fontWeight};
  line-height: ${typography.presets.bigScreenQuestion.lineHeight};
  color: ${colors.typeMain};
  margin-bottom: 3rem;
  text-align: center;

  @media (max-width: 1024px) {
    font-size: ${typography.fontSize.display2xl};
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: ${typography.fontSize.displaymd};
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
  border: 2px solid ${colors.border};
  border-radius: 0.5rem;
  background-color: ${props => 
    props.$showAnswer && props.$isCorrect ? colors.green[500] : colors.surface};
  color: ${props => 
    props.$showAnswer && props.$isCorrect ? colors.surface : colors.typeMain};
  font-family: ${typography.presets.bigScreenOption.fontFamily};
  font-size: ${typography.presets.bigScreenOption.fontSize};
  font-weight: ${typography.presets.bigScreenOption.fontWeight};
  line-height: ${typography.presets.bigScreenOption.lineHeight};
  text-align: center;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 1.5rem;
    font-size: ${typography.fontSize.displaymd};
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: ${typography.fontSize.base};
  }
`;

export const BigScreenExplanation = styled.div`
  padding: 2rem;
  background-color: ${colors.surface};
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.displaymd};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  color: ${colors.typeMain};
  border: 1px solid ${colors.border};

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: ${typography.fontSize.base};
  }
`;

export const BigScreenLeaderboardSection = styled(LeaderboardSection)`
  margin-top: 2rem;
  background-color: ${colors.surface};
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.border};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const BigScreenLeaderboardHeading = styled(LeaderboardHeading)`
  font-size: ${typography.fontSize.display2xl};
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: ${typography.fontSize.base};
    margin-bottom: 1rem;
  }
`;

export const BigScreenLeaderboardItem = styled(LeaderboardItem)`
  font-size: ${typography.fontSize.displaymd};
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    font-size: ${typography.fontSize.base};
    margin-bottom: 0.5rem;
  }
`;

// Error title with red color
export const ErrorTitle = styled.h1`
  font-family: ${typography.presets.h1.fontFamily};
  font-size: ${typography.presets.h1.fontSize};
  font-weight: ${typography.presets.h1.fontWeight};
  line-height: ${typography.presets.h1.lineHeight};
  color: #ef4444;
  text-align: center;
  margin: 0 0 2rem 0;
`;
