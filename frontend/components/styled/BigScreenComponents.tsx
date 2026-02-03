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
  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;

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
  margin-bottom: 2rem;
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

export const BigScreenQuestionText = styled.h1`
  font-family: ${typography.presets.h1.fontFamily};
  font-size: ${typography.presets.h1.fontSize};
  font-weight: ${typography.presets.h1.fontWeight};
  line-height: ${typography.presets.h1.lineHeight};
  color: ${colors.typeMain};
  margin-bottom: 3rem;
  text-align: center;

  @media (max-width: 1200px) {
    font-size: ${typography.fontSize.displaymd};
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: ${typography.fontSize.displaymd};
    margin-bottom: 1.5rem;
  }
`;

export const BigScreenOptionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 0 3rem 0;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin: 0 0 1.5rem 0;
  }
`;

export const BigScreenOptionBox = styled.div<{ $isCorrect?: boolean; $showAnswer?: boolean }>`
  width: 100%;
  padding: 2.5rem;
  border: 2px solid ${colors.border};
  border-radius: 100px;
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
  
  background-color: ${colors.surface};
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.normal};
  color: ${colors.typeMain};
  

  @media (max-width: 768px) {
    
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

// Two-column layout for big screen
export const BigScreenLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: stretch;
  margin-right: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

// Game play status container (left side with commentary and leaderboard)
export const GamePlayStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 60%;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 1200px) {
    width: 50%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Right side container for question area
export const BigScreenRightContainer = styled.div`
  width: 40%;
  min-height: 100vh;
  background-color: ${colors.bgContrast};
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 2rem;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;

  @media (max-width: 1200px) {
    width: 50%;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-height: auto;
  }
`;

// Round start waiting: loading spinner and text (right panel)
export const RoundStartLoadingSpinner = styled.div`
  width: 80px;
  height: 80px;
  border: 6px solid ${colors.surface};
  border-top-color: ${colors.accent};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const RoundStartLoadingText = styled.div`
  font-family: ${typography.fontFamily.dmSans};
  font-size: 1.5rem;
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.surface};
  margin-top: 1.5rem;
`;

// Big screen container with blue background
export const BigScreenContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.primary};
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-right: 0;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

// Game title for big screen (Wildcard in white, Trivia! in yellow)
export const BigScreenGameTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${typography.fontFamily.itim};
  font-size: 3rem;
  font-weight: ${typography.fontWeight.bold};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const BigScreenGameTitlePart = styled.span<{ $color: string }>`
  color: ${props => props.$color};
`;

// Trivi commentary card
export const TriviCommentaryCard = styled.div`
  background-color:${colors.surface};
  border-radius: 32px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  box-shadow: none;
`;

// Character container for Trivi commentary card
export const TriviCommentaryCharacterContainer = styled.div`
  border-radius: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-width: 60px;
  min-height: 60px;
  max-width: 200px;
  max-height: 200px;
  flex-shrink: 1;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: fit-content;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    
  }
`;

// Text container for Trivi commentary card
export const TriviCommentaryTextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 60%;
  gap: 0.5rem;
  width: 100%;

 
  
  
`;

// Trivi commentary title text
export const TriviCommentaryTitle = styled.div`
  font-family: ${typography.presets.Commentary.fontFamily};
  font-size: 40px;
  font-weight: ${typography.presets.Commentary.fontWeight};
  line-height: ${typography.presets.Commentary.lineHeight};
  color: ${colors.typeMain};
  width: 100%;
  height: fit-content;

  
`;

// Trivi commentary body text
export const TriviCommentaryBody = styled.div`
  font-family: ${typography.presets.Commentary.fontFamily};
  font-size: ${typography.presets.Commentary.fontSize};
  font-weight: ${typography.presets.Commentary.fontWeight};
  line-height: ${typography.presets.Commentary.lineHeight};
  color: ${colors.typeMain};
  width: fit-content;
  height: fit-content;

   @media (max-width: 768px) {
    line-height: 1;
  }

  
`;

// Question progress text
export const QuestionProgress = styled.div`
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.sm};
  color: ${colors.typeSecondary};
  text-align: center;
  margin-bottom: 1rem;
`;

// Top bar with round info and timer
export const BigScreenTopBar = styled.div`
  
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: ${colors.bgContrast};
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
  font-family: ${typography.fontFamily.dmSans};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  z-index: 10;
  
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 1rem;
  }
`;

export const TimerBadge = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.bold};
`;

// Leaderboard card for big screen (left side)
export const BigScreenLeaderboardCard = styled.div`
  background-color: ${colors.surface};
  border-radius: 32px;
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.border};

 
  @media (max-width: 768px) {
    max-width: 100%;
    min-height: auto;
  }
`;

// Leaderboard item with colored score
export const LeaderboardScore = styled.span`
  color: ${colors.typeAccent};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.lg};
`;

// Animated "+N" badge when a player gains points (shown after answer reveal)
export const PointsGainBadge = styled.span`
  display: inline-block;
  margin-left: 0.35rem;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  background: ${colors.green[500]};
  color: ${colors.surface};
  font-weight: ${typography.fontWeight.bold};
  font-size: ${typography.fontSize.sm};
  animation: pointsPop 0.5s ease-out;
  @keyframes pointsPop {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
`;

// Body text for card content (matches theme body preset)
export const BigScreenBodyText = styled.p`
  font-family: ${typography.presets.body.fontFamily};
  font-size: ${typography.presets.body.fontSize};
  font-weight: ${typography.presets.body.fontWeight};
  line-height: ${typography.presets.body.lineHeight};
  color: ${colors.typeMain};
  margin: 0;
`;

// Question content card (right side)
export const BigScreenQuestionCard = styled(BigScreenCard)`
  flex: 1;
  border-radius: 32px;
  background-color: ${colors.surface};
`;

// --- Create Game screen (same layout/style as BigScreen) ---

// Left section for create game (~1/3): title + welcome card
export const CreateGameLeftSection = styled(GamePlayStatus)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 60%;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 1200px) {
    width: 50%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Welcome card with cream/yellow background (Hi there! Create a room to get started.)
export const CreateGameWelcomeCard = styled(TriviCommentaryCard)`
  background-color: ${colors.surface};
  border-radius: 32px;

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Right section for create game: form in white card (reuse BigScreenRightContainer)
// CreateGameFormCard = white card inside right container (fills screen height when content is short)
export const CreateGameFormCard = styled(BigScreenCard)`
  max-width: 32rem;
  border-radius: 32px;
  margin: 0 auto;
  flex: 1;
  min-height: calc(100vh - 4rem);
  justify-content: center;
  overflow-y: auto;
`;

// Section title "Game Room Setup" centered
export const CreateGameSectionTitle = styled.h2`
  font-family: ${typography.presets.h2.fontFamily};
  font-size: ${typography.presets.h2.fontSize};
  font-weight: ${typography.presets.h2.fontWeight};
  line-height: ${typography.presets.h2.lineHeight};
  color: ${colors.typeMain};
  text-align: center;
  margin: 0 0 2rem 0;
`;

// Duration helper text (e.g. "Your game will take around x min.")
export const CreateGameDurationText = styled.p`
  font-family: ${typography.presets.bodySmall.fontFamily};
  font-size: ${typography.presets.bodySmall.fontSize};
  font-weight: ${typography.presets.bodySmall.fontWeight};
  line-height: ${typography.presets.bodySmall.lineHeight};
  color: ${colors.typeSecondary};
  text-align: center;
  margin: 1rem 0 0 0;
`;

// Start Game screen: card fills screen height when content is short (same as CreateGameFormCard)
export const StartGameFormCard = styled(CreateGameFormCard)`
  max-width: 36rem;
  width: 100%;
`;

// --- Game Finished: two-column desktop, stacked mobile (mobile order: trivi → awards → leaderboard) ---

/** Wrapper that hides the player header when layout is 2-column (desktop) so the game-finished view is full-bleed. */
export const GameFinishedHeaderWrap = styled.div`
  @media (min-width: 1024px) {
    display: none;
  }
`;

export const GameFinishedLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 60% 1fr;
    grid-template-rows: 1fr;
    align-items: stretch;
  }
`;

export const GameFinishedTriviSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1rem 1rem 2rem;
  overflow-y: auto;
  width: 100%;

  @media (max-width: 1023px) {
    order: 1;
  }

  @media (min-width: 1024px) {
    grid-column: 1;
    grid-row: 1;
    padding: 1.5rem 2rem;
  }
`;

export const GameFinishedAwardsSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
  width: 100%;
  background-color: ${colors.bgContrast};

  @media (max-width: 1023px) {
    order: 2;
  }

  @media (min-width: 1024px) {
    grid-column: 2;
    grid-row: 1;
    align-self: stretch;
    min-height: 100%;
    padding: 2rem;
    margin-right: 0;
  }
`;

export const GameFinishedLeaderboardButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  width: 100%;

  @media (max-width: 1023px) {
    order: 3;
  }

  @media (min-width: 1024px) {
    grid-column: 1;
    grid-row: 2;
    padding: 1rem 2rem;
  }
`;

/** @deprecated Use GameFinishedTriviSection + GameFinishedLeaderboardButtonSection for mobile order. Kept for any other usage. */
export const GameFinishedLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  overflow-y: auto;
  width: 100%;

  @media (min-width: 1024px) {
    width: 60%;
    padding: 2rem;
  }

  @media (max-width: 1023px) {
    order: 1;
  }
`;

/** @deprecated Use GameFinishedAwardsSection for game-finished layout. */
export const GameFinishedRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
  width: 100%;
  background-color: ${colors.bgContrast};

  @media (min-width: 1024px) {
    width: 40%;
    padding: 2rem;
  }

  @media (max-width: 1023px) {
    order: 2;
  }
`;

export const GameFinishedTitleImg = styled.img`
  width: 100%;
  max-width: 20rem;
  margin-bottom: 1rem;
  align-self: center;

  @media (max-width: 1023px) {
    display: none;
  }
`;

export const GameFinishedTriviCard = styled.div`
  background-color: ${colors.surface};
  border-radius: 32px;
  padding: 40px 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

export const GameFinishedStatsComment = styled.div`
  font-family: ${typography.fontFamily.itim};
  font-size: 24px;
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.relaxed};
  color: ${colors.typeMain};
  width: 100%;
  text-align: center;
  margin: 0;
`;

export const GameFinishedAwardsSectionTitle = styled.h2`
  font-family: ${typography.presets.h2.fontFamily};
  font-size: ${typography.presets.h2.fontSize};
  font-weight: ${typography.presets.h2.fontWeight};
  line-height: ${typography.presets.h2.lineHeight};
  color: ${colors.surface};
  text-align: center;
  margin: 0 0 1.5rem 0;
`;

export const GameFinishedAwardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
`;

export const GameFinishedAwardCard = styled.div`
  background-color: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (min-width: 1024px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const GameFinishedAwardCardVertical = styled.div`
  background-color: ${colors.surface};
  border-radius: 32px;
  padding: 32px 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  border: 1px solid ${colors.border};
`;

export const GameFinishedAwardAvatars = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex-shrink: 0;
`;

export const GameFinishedAwardNames = styled.span`
  font-family: ${typography.presets.body.fontFamily};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.typeSecondary};
  flex: 1;
  min-width: 0;
`;

export const GameFinishedAwardName = styled.span`
  font-family: ${typography.presets.h3.fontFamily};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.typeMain};
  line-height: ${typography.lineHeight.tight};
`;
