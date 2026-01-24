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
} from './styled/GameComponents';
import { ButtonLarge, ButtonContainerCenter } from './styled/FormComponents';

interface LeaderboardEntry {
  playerId: string;
  rank: number;
  playerName: string;
  points: number;
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
                No{entry.rank} {entry.playerName} ... {entry.points} pts,
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
