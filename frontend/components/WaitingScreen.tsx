'use client';

import {
  GameScreenContainer,
  GameCard,
  GameHeader,
  CircularBadge,
  GameTitle,
  FeedbackMessage,
} from './styled/GameComponents';

interface WaitingScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  timer?: number;
}

export default function WaitingScreen({
  currentQuestion,
  totalQuestions,
  timer,
}: WaitingScreenProps) {
  return (
    <GameScreenContainer>
      <GameCard>
        <GameHeader>
          <CircularBadge>{currentQuestion}/{totalQuestions}</CircularBadge>
          {timer !== undefined && <CircularBadge>{timer}</CircularBadge>}
        </GameHeader>
        <GameTitle>Ultimate Trivia!</GameTitle>
        <FeedbackMessage style={{ fontSize: '1.5rem', marginTop: '2rem' }}>
          ⏳ Waiting for everyone else to finish...
        </FeedbackMessage>
        <div style={{ 
          textAlign: 'center', 
          color: '#9ca3af', 
          marginTop: '1rem',
          fontSize: '0.875rem'
        }}>
          You'll see the results when the timer expires
        </div>
      </GameCard>
    </GameScreenContainer>
  );
}
