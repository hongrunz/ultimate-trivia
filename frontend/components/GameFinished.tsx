'use client';

import { useRouter } from 'next/navigation';
import {
  GameScreenContainer,
  GameCard,
  GameTitle,
  LeaderboardSection,
  LeaderboardHeading,
  LeaderboardList,
  LeaderboardItem,
  TopicBadge,
} from './styled/GameComponents';
import { ButtonLarge, ButtonContainerCenter } from './styled/FormComponents';

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
}

export default function GameFinished({
  leaderboard,
}: GameFinishedProps) {
  const router = useRouter();

  const handleNewGame = () => {
    router.push('/');
  };

  return (
    <GameScreenContainer>
      <GameCard>
        <GameTitle>Game Finished! 🎉</GameTitle>
        <LeaderboardSection>
          <LeaderboardHeading>Leader board:</LeaderboardHeading>
          <LeaderboardList>
            {leaderboard.map((entry) => (
              <LeaderboardItem key={entry.playerId}>
                <div>
                  No{entry.rank} {entry.playerName} ... {entry.points} pts
                </div>
                {entry.topicScore && Object.keys(entry.topicScore).length > 0 && (
                  <div style={{ marginTop: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {Object.entries(entry.topicScore).map(([topic, score]) => (
                      <TopicBadge key={topic} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                        {topic}: {score}
                      </TopicBadge>
                    ))}
                  </div>
                )}
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        </LeaderboardSection>
        <ButtonContainerCenter>
          <ButtonLarge onClick={handleNewGame}>New Game</ButtonLarge>
        </ButtonContainerCenter>
      </GameCard>
    </GameScreenContainer>
  );
}
