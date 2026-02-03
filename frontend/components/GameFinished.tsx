'use client';

import { useRouter } from 'next/navigation';
import PlayerHeader from './PlayerHeader';
import {
  GameScreenContainer,
  GameScreenContent,
  GameCard,
  GameTitle,
  PlayerListTitle,
  PlayerListItem,
  PlayerListItemAvatar,
  PlayerListItemName,
  PlayerListContainer,
} from './styled/GameComponents';
import { BigScreenLeaderboardCard, LeaderboardScore } from './styled/BigScreenComponents';
import { ButtonLarge, ButtonContainerCenter } from './styled/FormComponents';
import { MutedText } from './styled/StatusComponents';

interface LeaderboardEntry {
  playerId: string;
  rank: number;
  playerName: string;
  points: number;
  topicScore?: { [topic: string]: number };
}

interface GameFinishedProps {
  totalQuestions: number;
  finalScore?: number;
  leaderboard: LeaderboardEntry[];
  showLeaderboard?: boolean;
}

export default function GameFinished({
  leaderboard,
  showLeaderboard = true,
}: GameFinishedProps) {
  const router = useRouter();

  const handleNewGame = () => {
    router.push('/');
  };

  return (
    <GameScreenContainer>
      <PlayerHeader />
      <GameScreenContent>
        <GameCard>
          <GameTitle>Game Finished! 🎉</GameTitle>
          {showLeaderboard && (
            <BigScreenLeaderboardCard>
              <PlayerListTitle>Leaderboard</PlayerListTitle>
              <PlayerListContainer>
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => {
                    const avatarCount = 10;
                    const avatarIndex = (index % avatarCount) + 1;
                    const avatarSrc = `/assets/avatars/avatar_${avatarIndex}.svg`;
                    const highlight = entry.rank <= 3;
                    return (
                      <PlayerListItem
                        key={entry.playerId}
                        style={{
                          backgroundColor: highlight ? 'rgba(255, 215, 0, 0.15)' : undefined,
                          border: highlight ? '2px solid rgba(255, 215, 0, 0.6)' : undefined,
                          borderRadius: '0.5rem',
                          padding: '0.5rem',
                        }}
                      >
                        <PlayerListItemAvatar $avatarSrc={avatarSrc}>
                          {entry.playerName.charAt(0).toUpperCase()}
                        </PlayerListItemAvatar>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                          <PlayerListItemName>
                            {entry.rank === 1 && '🥇 '}
                            {entry.rank === 2 && '🥈 '}
                            {entry.rank === 3 && '🥉 '}
                            #{entry.rank} {entry.playerName}
                          </PlayerListItemName>
                          <LeaderboardScore>{entry.points}</LeaderboardScore>
                        </div>
                      </PlayerListItem>
                    );
                  })
                ) : (
                  <MutedText style={{ textAlign: 'center', padding: '2rem 0' }}>
                    No scores yet
                  </MutedText>
                )}
              </PlayerListContainer>
            </BigScreenLeaderboardCard>
          )}
          <ButtonContainerCenter>
            <ButtonLarge onClick={handleNewGame}>New Game</ButtonLarge>
          </ButtonContainerCenter>
        </GameCard>
      </GameScreenContent>
    </GameScreenContainer>
  );
}
