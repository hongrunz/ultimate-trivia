'use client';

import { useState, useEffect, useCallback } from 'react';
import GameFinished from './GameFinished';
import { api, RoomResponse, LeaderboardResponse } from '../lib/api';
import { useWebSocket } from '../lib/useWebSocket';
import { useBackgroundMusic } from '../lib/useBackgroundMusic';
import { useGameTimer } from '../lib/useGameTimer';
import MusicControl from './MusicControl';
import {
  GameScreenContainer,
  GameTitle,
  LeaderboardSection,
  LeaderboardHeading,
  LeaderboardList,
  LeaderboardItem,
} from './styled/GameComponents';
import styled from 'styled-components';

interface BigScreenDisplayProps {
  roomId: string;
}

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  points: number;
}

type GameState = 'question' | 'submitted' | 'finished';

// Styled components for big screen (scaled up version of mobile styles)
const BigScreenCard = styled.div`
  background-color: #e5e7eb;
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

const BigScreenHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
`;

const BigScreenBadge = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2rem;
  color: #000000;

  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
`;

const BigScreenQuestionText = styled.p`
  font-size: 3rem;
  color: #000000;
  margin-bottom: 3rem;
  text-align: center;
  line-height: 1.3;
  font-weight: 600;

  @media (max-width: 1024px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const BigScreenOptionsContainer = styled.div`
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

const BigScreenOptionBox = styled.div<{ $isCorrect?: boolean; $showAnswer?: boolean }>`
  width: 100%;
  padding: 2.5rem;
  border: 2px solid #9ca3af;
  border-radius: 0.5rem;
  background-color: ${props => 
    props.$showAnswer && props.$isCorrect ? '#10b981' : '#ffffff'};
  color: ${props => 
    props.$showAnswer && props.$isCorrect ? '#ffffff' : '#111827'};
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 1.5rem;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

const BigScreenExplanation = styled.div`
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #000000;
  border: 1px solid #9ca3af;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const BigScreenLeaderboardSection = styled(LeaderboardSection)`
  margin-top: 2rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #9ca3af;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BigScreenLeaderboardHeading = styled(LeaderboardHeading)`
  font-size: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

const BigScreenLeaderboardItem = styled(LeaderboardItem)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

export default function BigScreenDisplay({ roomId }: BigScreenDisplayProps) {
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [gameState, setGameState] = useState<GameState>('question');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameStartedAt, setGameStartedAt] = useState<Date | null>(null);

  // Helper function to map leaderboard data to UI format
  const mapLeaderboardData = useCallback((
    leaderboardData: LeaderboardResponse,
    players: RoomResponse['players']
  ): LeaderboardEntry[] => {
    const playerMap = new Map(
      players.map(p => [p.playerId, p.playerName])
    );
    
    return leaderboardData.leaderboard.map((entry, index) => ({
      rank: index + 1,
      playerName: playerMap.get(entry.playerId) || `Player ${entry.playerId.slice(0, 8)}`,
      points: entry.score,
    }));
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const leaderboardData = await api.getLeaderboard(roomId);
      
      // Use current room data or fetch if not available
      let currentRoom = room;
      if (!currentRoom) {
        currentRoom = await api.getRoom(roomId);
        setRoom(currentRoom);
      }
      
      const formattedLeaderboard = mapLeaderboardData(leaderboardData, currentRoom.players);
      setLeaderboard(formattedLeaderboard);
    } catch {
      setLeaderboard([]);
    }
  }, [roomId, room, mapLeaderboardData]);

  const fetchRoom = useCallback(async () => {
    try {
      const roomData = await api.getRoom(roomId);
      setRoom(roomData);

      if (roomData.status === 'started' && roomData.questions) {
        setIsLoading(false);
        setGameState('question');
        
        // Parse and set game start timestamp for timer synchronization
        if (roomData.startedAt) {
          const startTime = new Date(roomData.startedAt);
          if (!isNaN(startTime.getTime())) {
            setGameStartedAt(startTime);
          }
        }
        
        fetchLeaderboard();
      } else if (roomData.status === 'finished') {
        setGameState('finished');
        setIsLoading(false);
        fetchLeaderboard();
      } else {
        setGameState('question');
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
      setIsLoading(false);
    }
  }, [roomId, fetchLeaderboard]);

  // Timer callbacks
  const handleGameFinished = useCallback(() => {
    setGameState('finished');
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleTimerExpired = useCallback(() => {
    // Just stay in question state, but players can't submit anymore
  }, []);

  const handleQuestionChanged = useCallback(() => {
    setGameState('question');
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Game timer hook
  const { timer, currentQuestionIndex } = useGameTimer({
    room,
    gameStartedAt,
    gameState,
    onGameFinished: handleGameFinished,
    onTimerExpired: handleTimerExpired,
    onQuestionChanged: handleQuestionChanged,
  });

  // Initial room fetch
  useEffect(() => {
    fetchRoom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((message: {
    type: string;
    startedAt?: string;
    player?: {
      playerId: string;
      playerName: string;
      joinedAt: string;
    };
  }) => {
    if (message.type === 'game_started') {
      if (message.startedAt) {
        const startTime = new Date(message.startedAt);
        if (!isNaN(startTime.getTime())) {
          setGameStartedAt(startTime);
        }
      }
      fetchRoom();
      return;
    }
    
    if (message.type === 'answer_submitted') {
      fetchLeaderboard();
      return;
    }
    
    if (message.type === 'player_joined' && message.player) {
      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        
        const playerExists = prevRoom.players.some(
          (p) => p.playerId === message.player!.playerId
        );
        
        if (playerExists) return prevRoom;
        
        return {
          ...prevRoom,
          players: [
            ...prevRoom.players,
            {
              playerId: message.player!.playerId,
              playerName: message.player!.playerName,
              score: 0,
              joinedAt: message.player!.joinedAt,
            }
          ],
        };
      });
    }
  }, [fetchRoom, fetchLeaderboard]);

  // WebSocket connection
  useWebSocket(roomId, {
    onMessage: handleWebSocketMessage,
  });

  // Background music
  const { isMuted, toggleMute, isLoaded } = useBackgroundMusic('/background-music.mp3', {
    autoPlay: true,
    loop: true,
    volume: 0.3,
  });

  // Loading state
  if (isLoading) {
    return (
      <>
        <MusicControl isMuted={isMuted} onToggle={toggleMute} disabled={!isLoaded} />
        <GameScreenContainer>
          <BigScreenCard>
            <GameTitle>Loading game...</GameTitle>
          </BigScreenCard>
        </GameScreenContainer>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <MusicControl isMuted={isMuted} onToggle={toggleMute} disabled={!isLoaded} />
        <GameScreenContainer>
          <BigScreenCard>
            <GameTitle style={{ color: '#ef4444' }}>Error: {error}</GameTitle>
          </BigScreenCard>
        </GameScreenContainer>
      </>
    );
  }

  // Waiting for game to start
  if (!room?.questions?.length) {
    return (
      <>
        <MusicControl isMuted={isMuted} onToggle={toggleMute} disabled={!isLoaded} />
        <GameScreenContainer>
          <BigScreenCard>
            <GameTitle>Waiting for game to start...</GameTitle>
          </BigScreenCard>
        </GameScreenContainer>
      </>
    );
  }

  // Check for server sync during active gameplay
  if (gameState === 'question' && !gameStartedAt) {
    return (
      <>
        <MusicControl isMuted={isMuted} onToggle={toggleMute} disabled={!isLoaded} />
        <GameScreenContainer>
          <BigScreenCard>
            <GameTitle>Synchronizing with server...</GameTitle>
          </BigScreenCard>
        </GameScreenContainer>
      </>
    );
  }

  const currentQuestion = room.questions[currentQuestionIndex];
  
  // Question loading state
  if (!currentQuestion) {
    return (
      <>
        <MusicControl isMuted={isMuted} onToggle={toggleMute} disabled={!isLoaded} />
        <GameScreenContainer>
          <BigScreenCard>
            <GameTitle>Loading question {currentQuestionIndex + 1}...</GameTitle>
          </BigScreenCard>
        </GameScreenContainer>
      </>
    );
  }

  // Game finished state
  if (gameState === 'finished') {
    return (
      <>
        <MusicControl isMuted={isMuted} onToggle={toggleMute} disabled={!isLoaded} />
        <GameFinished
          totalQuestions={room.questionsPerRound}
          finalScore={0} // Big screen doesn't have a score
          leaderboard={leaderboard}
        />
      </>
    );
  }

  // Active question display
  return (
    <>
      <MusicControl isMuted={isMuted} onToggle={toggleMute} disabled={!isLoaded} />
      <GameScreenContainer>
        <BigScreenCard>
          {/* Header with question number and timer */}
          <BigScreenHeader>
            <BigScreenBadge>
              {currentQuestionIndex + 1}/{room.questionsPerRound}
            </BigScreenBadge>
            <BigScreenBadge>
              {timer}
            </BigScreenBadge>
          </BigScreenHeader>

          {/* Title */}
          <GameTitle>Ultimate Trivia!</GameTitle>

          {/* Question text */}
          <BigScreenQuestionText>
            {currentQuestion.question}
          </BigScreenQuestionText>

          {/* Options */}
          <BigScreenOptionsContainer>
            {currentQuestion.options.map((option, index) => (
              <BigScreenOptionBox 
                key={index}
                $showAnswer={timer !== undefined && timer <= 0}
                $isCorrect={index === currentQuestion.correctAnswer}
              >
                {option}
              </BigScreenOptionBox>
            ))}
          </BigScreenOptionsContainer>

          {/* Show explanation after time expires */}
          {timer !== undefined && timer <= 0 && currentQuestion.explanation && (
            <BigScreenExplanation>
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </BigScreenExplanation>
          )}

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <BigScreenLeaderboardSection>
              <BigScreenLeaderboardHeading>Leader board:</BigScreenLeaderboardHeading>
              <LeaderboardList>
                {leaderboard.slice(0, 5).map((entry) => (
                  <BigScreenLeaderboardItem key={entry.rank}>
                    <span>No{entry.rank} {entry.playerName}</span>
                    <span>... {entry.points} pts,</span>
                  </BigScreenLeaderboardItem>
                ))}
              </LeaderboardList>
            </BigScreenLeaderboardSection>
          )}
        </BigScreenCard>
      </GameScreenContainer>
    </>
  );
}
