'use client';

import {
  GameScreenContainer,
  GameTitle,
  GameTitleImage,
} from './styled/GameComponents';
import {
  BigScreenCard,
  BigScreenHeader,
  BigScreenBadge,
} from './styled/BigScreenComponents';
import { MutedText } from './styled/StatusComponents';

interface BigScreenNewRoundProps {
  currentRound: number;
  totalRounds: number;
  submittedCount: number;
  totalPlayers: number;
}

export default function BigScreenNewRound({
  currentRound,
  totalRounds,
  submittedCount,
  totalPlayers,
}: BigScreenNewRoundProps) {
  return (
    <GameScreenContainer>
      <GameTitleImage src="/assets/game_title.svg" alt="Ultimate Trivia" />
      <BigScreenCard>
        <BigScreenHeader>
          <BigScreenBadge>
            Round {currentRound}/{totalRounds}
          </BigScreenBadge>
          <BigScreenBadge>
            {submittedCount}/{totalPlayers} Ready
          </BigScreenBadge>
        </BigScreenHeader>

        <GameTitle style={{ fontSize: '3rem', marginBottom: '2rem' }}>
          New Round Starting! 🎯
        </GameTitle>

        <MutedText style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
          Players are submitting topics...
        </MutedText>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '3rem'
        }}>
          {Array.from({ length: totalPlayers }).map((_, index) => (
            <div
              key={index}
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: index < submittedCount 
                  ? 'rgba(34, 197, 94, 0.3)' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: index < submittedCount 
                  ? '3px solid rgb(34, 197, 94)' 
                  : '3px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                transition: 'all 0.3s ease'
              }}
            >
              {index < submittedCount ? '✓' : ''}
            </div>
          ))}
        </div>

        <MutedText style={{ fontSize: '1rem', textAlign: 'center', marginTop: '3rem' }}>
          Waiting for all players to submit their topics...
        </MutedText>
      </BigScreenCard>
    </GameScreenContainer>
  );
}
