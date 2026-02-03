'use client';

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
import { MutedText } from './styled/StatusComponents';

interface LeaderboardEntry {
  playerId: string;
  rank: number;
  playerName: string;
  points: number;
}

interface RoundFinishedProps {
  currentRound: number;
  totalRounds: number;
  leaderboard: LeaderboardEntry[];
  timer?: number;
}

export default function RoundFinished({
  currentRound,
  totalRounds,
  leaderboard,
  timer,
}: RoundFinishedProps) {
  const topThree = leaderboard.slice(0, 3);
  const isTopThree = (playerId: string) => topThree.some((entry) => entry.playerId === playerId);

  return (
    <GameScreenContainer>
      <PlayerHeader />

      <GameScreenContent>
        <GameTitle>Round {currentRound} Complete! 🎊</GameTitle>
        <GameCard>
          <MutedText style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            {currentRound < totalRounds
              ? `Get ready for Round ${currentRound + 1}...`
              : 'Final round complete! Calculating results...'}
          </MutedText>

          {timer !== undefined && currentRound < totalRounds && (
            <div
              style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0)',
              }}
            >
              {timer}s
            </div>
          )}

          <BigScreenLeaderboardCard>
            <PlayerListTitle>Leaderboard</PlayerListTitle>
            <PlayerListContainer>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => {
                  const avatarCount = 10;
                  const avatarIndex = (index % avatarCount) + 1;
                  const avatarSrc = `/assets/avatars/avatar_${avatarIndex}.svg`;
                  const highlight = isTopThree(entry.playerId);
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

          <MutedText style={{ fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
            {currentRound < totalRounds
              ? 'Stay focused! The next round is about to begin...'
              : 'Preparing final results...'}
          </MutedText>
        </GameCard>
      </GameScreenContent>
    </GameScreenContainer>
  );
}
