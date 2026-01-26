import styled from 'styled-components';
import { colors, typography } from './theme';

export const QRCodeContainer = styled.div`
  background-color: ${colors.surface};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PlayerAvatar = styled.div<{ $bgColor?: string; $avatarSrc?: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${props => props.$bgColor || colors.accent};
  background-image: ${props => props.$avatarSrc ? `url(${props.$avatarSrc})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$avatarSrc ? 'transparent' : colors.surface};
  font-family: ${typography.fontFamily.dmSans};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.lg};
  line-height: ${typography.lineHeight.tight};
  overflow: hidden;
`;

export const PlayerList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// Player List Card Components
export const CardsContainer = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 60rem;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    max-width: 28rem;
  }
`;

export const PlayerListCard = styled.div`
  background-color: ${colors.surface};
  border-radius: 40px;
  padding: 2rem;
  width: 100%;
  max-width: 20rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 28rem;
    min-height: auto;
  }
`;

export const PlayerListTitle = styled.h2`
  font-family: ${typography.presets.h2.fontFamily};
  font-size: ${typography.presets.h2.fontSize};
  font-weight: ${typography.presets.h2.fontWeight};
  line-height: ${typography.presets.h2.lineHeight};
  color: ${colors.typeMain};
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const PlayerListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${colors.surfaceSecondary};

  &:last-child {
    border-bottom: none;
  }
`;

export const PlayerListItemAvatar = styled(PlayerAvatar)`
  flex-shrink: 0;
`;

export const PlayerListItemName = styled.span`
  font-family: ${typography.presets.body.fontFamily};
  font-size: ${typography.presets.body.fontSize};
  font-weight: ${typography.presets.body.fontWeight};
  line-height: ${typography.presets.body.lineHeight};
  color: ${colors.typeMain};
  flex: 1;
`;

export const PlayerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  overflow-y: auto;
  max-height: 500px;

  @media (max-width: 768px) {
    max-height: 300px;
  }
`;

// Game Title Image
export const GameTitleImage = styled.img`
  width: 100%;
  max-width: 30rem;
  height: auto;
  margin: 0 auto 2rem auto;
  display: block;
  
  @media (max-width: 768px) {
    max-width: 20rem;
    margin-bottom: 1.5rem;
  }
`;

export const Ellipsis = styled.span`
  color: ${colors.bgContrast};
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
`;

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BottomSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 2rem;
`;

export const TopicsSection = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

export const TopicsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

export const TopicBadge = styled.span`
  padding: 0.5rem 1rem;
  background-color: ${colors.surfaceSecondary};
  border: 1px solid ${colors.border};
  border-radius: 1rem;
  font-family: ${typography.presets.badge.fontFamily};
  font-size: ${typography.presets.badge.fontSize};
  font-weight: ${typography.presets.badge.fontWeight};
  line-height: ${typography.presets.badge.lineHeight};
  color: ${colors.typeMain};
`;

// Game Screen Components
export const GameScreenContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.bgContrast};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const GameCard = styled.div`
  background-color: ${colors.surface};
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 400px;
`;

export const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

export const CircularBadge = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${typography.fontFamily.dmSans};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.tight};
  color: ${colors.typeMain};
`;

export const GameTitle = styled.h1`
  font-family: ${typography.presets.h1.fontFamily};
  font-size: ${typography.presets.h1.fontSize};
  font-weight: ${typography.presets.h1.fontWeight};
  line-height: ${typography.presets.h1.lineHeight};
  color: ${colors.typeMain};
  text-align: center;
  margin: 0 0 2rem 0;
`;

export const QuestionText = styled.p`
  font-family: ${typography.presets.body.fontFamily};
  font-size: ${typography.presets.body.fontSize};
  font-weight: ${typography.presets.body.fontWeight};
  line-height: ${typography.presets.body.lineHeight};
  color: ${colors.typeMain};
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const AnswerInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${colors.border};
  border-radius: 0.25rem;
  background-color: ${colors.surface};
  color: ${colors.typeMain};
  font-family: ${typography.presets.input.fontFamily};
  font-size: ${typography.presets.input.fontSize};
  font-weight: ${typography.presets.input.fontWeight};
  line-height: ${typography.presets.input.lineHeight};
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px ${colors.surfaceSecondary};
  }
`;

export const FeedbackMessage = styled.p`
  font-family: ${typography.presets.h3.fontFamily};
  font-size: ${typography.presets.h3.fontSize};
  font-weight: ${typography.presets.h3.fontWeight};
  line-height: ${typography.presets.h3.lineHeight};
  color: ${colors.typeMain};
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const LeaderboardSection = styled.div`
  margin-top: 2rem;
`;

export const LeaderboardHeading = styled.h2`
  font-family: ${typography.presets.h3.fontFamily};
  font-size: ${typography.presets.h3.fontSize};
  font-weight: ${typography.presets.h3.fontWeight};
  line-height: ${typography.presets.h3.lineHeight};
  color: ${colors.typeMain};
  margin-bottom: 1rem;
`;

export const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const LeaderboardItem = styled.li`
  font-family: ${typography.presets.body.fontFamily};
  font-size: ${typography.presets.body.fontSize};
  font-weight: ${typography.presets.body.fontWeight};
  line-height: ${typography.presets.body.lineHeight};
  color: ${colors.typeMain};
  margin-bottom: 0.5rem;
`;
