'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import PlayerHeader from './PlayerHeader';
import {
  GameFinishedScreenContainer,
  GameScreenContent,
  PlayerListItemAvatar,
} from './styled/GameComponents';
import {
  GameFinishedHeaderWrap,
  GameFinishedLayout,
  GameFinishedTriviSection,
  GameFinishedTitleImg,
  GameFinishedAwardsSection,
  GameFinishedTriviCard,
  TriviCommentaryCharacterContainer,
  TriviCommentaryTextContainer,
  TriviCommentaryTitle,
  GameFinishedStatsComment,
  GameFinishedAwardsSectionTitle,
  GameFinishedAwardsGrid,
  GameFinishedAwardCardVertical,
  GameFinishedAwardAvatars,
  GameFinishedAwardNames,
  GameFinishedAwardName,
} from './styled/BigScreenComponents';
import { ButtonLarge, ButtonContainerCenter } from './styled/FormComponents';
import { MutedText } from './styled/StatusComponents';
import { api, type GameStatsResponse } from '../lib/api';
import { colors } from './styled/theme';

interface LeaderboardEntry {
  playerId: string;
  rank: number;
  playerName: string;
  points: number;
  topicScore?: { [topic: string]: number };
}

interface GameFinishedProps {
  roomId?: string;
  /** When provided (e.g. preview), use this instead of fetching; no API call. */
  gameStats?: GameStatsResponse | null;
  totalQuestions?: number;
  finalScore?: number;
  leaderboard: LeaderboardEntry[];
}

export default function GameFinished({
  roomId,
  gameStats: gameStatsProp,
  leaderboard,
}: GameFinishedProps) {
  const router = useRouter();
  const [gameStatsFetched, setGameStatsFetched] = useState<GameStatsResponse | null>(null);
  const [gameStatsLoading, setGameStatsLoading] = useState(!!roomId && gameStatsProp === undefined);
  const [gameStatsError, setGameStatsError] = useState(false);

  const gameStats = gameStatsProp !== undefined ? gameStatsProp : gameStatsFetched;

  useEffect(() => {
    if (gameStatsProp !== undefined || !roomId) {
      setGameStatsFetched(null);
      setGameStatsLoading(false);
      return;
    }
    setGameStatsLoading(true);
    setGameStatsError(false);
    api
      .getGameStats(roomId)
      .then(setGameStatsFetched)
      .catch(() => setGameStatsError(true))
      .finally(() => setGameStatsLoading(false));
  }, [roomId, gameStatsProp]);

  const playerAvatarMap = useMemo(() => {
    const map = new Map<string, number>();
    leaderboard.forEach((entry, index) => {
      map.set(entry.playerId, (index % 10) + 1);
    });
    return map;
  }, [leaderboard]);

  const handleNewGame = () => {
    router.push('/');
  };

  return (
    <GameFinishedScreenContainer>
      <GameFinishedHeaderWrap>
        <PlayerHeader />
      </GameFinishedHeaderWrap>
      <GameScreenContent>
        <GameFinishedLayout>
          {/* Mobile order: 1 Trivi → 2 Awards → 3 Leaderboard + Button. Desktop: left = Trivi + Leaderboard + Button, right = Awards */}
          <GameFinishedTriviSection>
            <GameFinishedTitleImg src="/assets/game_title.svg" alt="Wildcard Trivia" />
            <GameFinishedTriviCard>
              <TriviCommentaryCharacterContainer>
                <img src="/assets/Trivi_laugh.svg" alt="Trivi" />
              </TriviCommentaryCharacterContainer>
              <TriviCommentaryTextContainer>
                <TriviCommentaryTitle>What a game!</TriviCommentaryTitle>
                {gameStatsLoading && (
                  <MutedText style={{ marginTop: '0.5rem' }}>Loading stats…</MutedText>
                )}
                {!gameStatsLoading && gameStatsError && (
                  <MutedText style={{ marginTop: '0.5rem' }}>Could not load game stats</MutedText>
                )}
                {!gameStatsLoading && gameStats && (
                  <GameFinishedStatsComment>{gameStats.triviComment}</GameFinishedStatsComment>
                )}
              </TriviCommentaryTextContainer>
            </GameFinishedTriviCard>
            <ButtonContainerCenter style={{ marginTop: '1.5rem' }}>
              <ButtonLarge onClick={handleNewGame}>Start a new game</ButtonLarge>
            </ButtonContainerCenter>
          </GameFinishedTriviSection>

          <GameFinishedAwardsSection>
            <GameFinishedAwardsSectionTitle>The Awards Go To…</GameFinishedAwardsSectionTitle>
            {!gameStatsLoading && gameStats && gameStats.awards.length > 0 ? (
              <GameFinishedAwardsGrid>
                {gameStats.awards.map((award, idx) => (
                  <GameFinishedAwardCardVertical key={`${award.awardName}-${idx}`}>
                    <GameFinishedAwardAvatars>
                      {award.playerIds.map((pid) => {
                        const avIdx = playerAvatarMap.get(pid) ?? ((pid.slice(0, 8).split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 10) + 1);
                        const avatarSrc = `/assets/avatars/avatar_${avIdx}.svg`;
                        return (
                          <PlayerListItemAvatar key={pid} $avatarSrc={avatarSrc}>
                            {award.playerNames[award.playerIds.indexOf(pid)]?.charAt(0).toUpperCase() ?? '?'}
                          </PlayerListItemAvatar>
                        );
                      })}
                    </GameFinishedAwardAvatars>
                    <GameFinishedAwardNames>
                      {award.playerNames.join(' & ')}
                    </GameFinishedAwardNames>
                    <GameFinishedAwardName>{award.awardName}</GameFinishedAwardName>
                  </GameFinishedAwardCardVertical>
                ))}
              </GameFinishedAwardsGrid>
            ) : (
              <MutedText style={{ textAlign: 'center', color: colors.surface }}>
                {gameStatsLoading ? 'Loading…' : 'No awards this time.'}
              </MutedText>
            )}
          </GameFinishedAwardsSection>
        </GameFinishedLayout>
      </GameScreenContent>
    </GameFinishedScreenContainer>
  );
}
