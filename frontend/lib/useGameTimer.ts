'use client';

import { useState, useEffect } from 'react';
import { RoomResponse } from './api';

interface UseGameTimerOptions {
  room: RoomResponse | null;
  gameStartedAt: Date | null;
  gameState: 'question' | 'waiting' | 'submitted' | 'finished';
  onGameFinished: () => void;
  onTimerExpired: () => void;
  onQuestionChanged: () => void;
}

const REVIEW_TIME_SECONDS = 8; // Time to show answer and leaderboard

export function useGameTimer({
  room,
  gameStartedAt,
  gameState,
  onGameFinished,
  onTimerExpired,
  onQuestionChanged,
}: UseGameTimerOptions) {
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Game timer synchronized with server timestamp
  useEffect(() => {
    const shouldRunTimer = 
      (gameState === 'question' || gameState === 'waiting' || gameState === 'submitted') && 
      room?.timePerQuestion && 
      gameStartedAt && 
      room.questions;

    if (!shouldRunTimer) return;

    const updateTimer = () => {
      if (!room.questions) return;
      
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - gameStartedAt.getTime()) / 1000);
      
      // Handle clock skew by treating negative values as 0
      const validElapsedSeconds = Math.max(0, elapsedSeconds);
      
      // Total time per question cycle = answer time + review time
      const totalTimePerCycle = room.timePerQuestion + REVIEW_TIME_SECONDS;
      const calculatedQuestionIndex = Math.floor(validElapsedSeconds / totalTimePerCycle);
      const timeInCurrentCycle = validElapsedSeconds % totalTimePerCycle;
      
      // Sync question index if needed
      if (calculatedQuestionIndex !== currentQuestionIndex && calculatedQuestionIndex < room.questions.length) {
        setCurrentQuestionIndex(calculatedQuestionIndex);
        onQuestionChanged();
      }
      
      // Check if game finished
      if (calculatedQuestionIndex >= room.questions.length) {
        onGameFinished();
        return;
      }
      
      // Update timer based on current phase
      if (timeInCurrentCycle < room.timePerQuestion) {
        // Answer phase (question or waiting)
        const remainingTime = room.timePerQuestion - timeInCurrentCycle;
        setTimer(Math.max(0, remainingTime));
      } else {
        // Review phase (submitted)
        const timeInReview = timeInCurrentCycle - room.timePerQuestion;
        const remainingReviewTime = REVIEW_TIME_SECONDS - timeInReview;
        setTimer(Math.max(0, remainingReviewTime));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);
    return () => clearInterval(interval);
  }, [gameState, currentQuestionIndex, room?.timePerQuestion, room?.questions, gameStartedAt, onGameFinished, onQuestionChanged]);

  // Handle timer expiration based on current state
  useEffect(() => {
    if (timer === 0) {
      if (gameState === 'question') {
        // Timer expired during question phase - auto-submit and move to waiting
        onTimerExpired();
      } else if (gameState === 'waiting') {
        // Timer expired during waiting phase - move to submitted (show answer)
        onTimerExpired();
      }
      // Note: When timer expires in 'submitted' state, onQuestionChanged is called
      // automatically by the main timer logic when calculatedQuestionIndex changes
    }
  }, [timer, gameState, onTimerExpired]);

  return {
    timer,
    currentQuestionIndex,
  };
}
