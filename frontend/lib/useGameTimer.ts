'use client';

import { useState, useEffect } from 'react';
import { RoomResponse } from './api';

interface UseGameTimerOptions {
  room: RoomResponse | null;
  gameStartedAt: Date | null;
  gameState: 'question' | 'waiting' | 'submitted' | 'roundFinished' | 'newRound' | 'finished';
  onGameFinished: () => void;
  onRoundFinished?: () => void;  // Called when a round completes (but more rounds remain)
  onRoundBreakComplete?: () => void;  // Called when round break timer completes
  onTimerExpired: () => void;
  onQuestionChanged: () => void;
}

const REVIEW_TIME_SECONDS = 8; // Time to show answer and leaderboard
const ROUND_BREAK_TIME_SECONDS = 10; // Time between rounds

export function useGameTimer({
  room,
  gameStartedAt,
  gameState,
  onGameFinished,
  onRoundFinished,
  onRoundBreakComplete,
  onTimerExpired,
  onQuestionChanged,
}: UseGameTimerOptions) {
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [roundBreakStartTime, setRoundBreakStartTime] = useState<number>(0); // timestamp in ms

  // Game timer synchronized with server timestamp
  useEffect(() => {
    const shouldRunTimer = 
      (gameState === 'question' || gameState === 'waiting' || gameState === 'submitted' || gameState === 'roundFinished') && 
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
      
      // Sync question index if needed (only for questions that exist)
      if (calculatedQuestionIndex !== currentQuestionIndex && calculatedQuestionIndex < room.questions.length) {
        setCurrentQuestionIndex(calculatedQuestionIndex);
        onQuestionChanged(); // Reset to 'question' state for the new question
      }
      
      // Update timer based on current phase
      if (timeInCurrentCycle < room.timePerQuestion) {
        // Answer phase (question or waiting)
        const remainingTime = room.timePerQuestion - timeInCurrentCycle;
        setTimer(Math.max(0, remainingTime));
      } else {
        // We're now in review phase
        // First, ensure we've transitioned from 'question' to 'waiting'
        if (gameState === 'question') {
          onTimerExpired(); // question -> waiting
        }
        // Then, ensure we've transitioned from 'waiting' to 'submitted'
        if (gameState === 'waiting') {
          onTimerExpired(); // waiting -> submitted
        }
        
        // Review phase (submitted) - set timer for review period
        const timeInReview = timeInCurrentCycle - room.timePerQuestion;
        const remainingReviewTime = REVIEW_TIME_SECONDS - timeInReview;
        setTimer(Math.max(0, remainingReviewTime));
        
        // For the last question, check if we should transition to roundFinished/finished
        if (calculatedQuestionIndex === room.questions.length - 1) {
          // When review of last question is done, transition to next state
          // BUT only if we're already in 'submitted' state (answer is being shown)
          if (remainingReviewTime <= 0 && gameState === 'submitted') {
            const hasMoreRounds = room.currentRound < room.numRounds;
            if (hasMoreRounds && onRoundFinished) {
              onRoundFinished();
            } else {
              onGameFinished();
            }
          }
        }
      }
      
      // Check if we've completely exceeded all questions + review time
      if (calculatedQuestionIndex >= room.questions.length) {
        // All questions AND review time are done
        const hasMoreRounds = room.currentRound < room.numRounds;
        if (hasMoreRounds && onRoundFinished) {
          onRoundFinished();
        } else {
          onGameFinished();
        }
        return;
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);
    return () => clearInterval(interval);
  }, [gameState, currentQuestionIndex, room?.timePerQuestion, room?.questions, room?.currentRound, room?.numRounds, gameStartedAt, onGameFinished, onQuestionChanged, onTimerExpired, onRoundFinished]);

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

  // Round break countdown timer
  useEffect(() => {
    if (gameState !== 'roundFinished') return;

    const updateRoundBreakTimer = () => {
      // Initialize start time on first run
      if (roundBreakStartTime === 0) {
        const startTime = Date.now();
        setRoundBreakStartTime(startTime);
        setTimer(ROUND_BREAK_TIME_SECONDS);
        return;
      }

      const now = Date.now();
      const elapsed = Math.floor((now - roundBreakStartTime) / 1000);
      const remaining = Math.max(0, ROUND_BREAK_TIME_SECONDS - elapsed);
      
      setTimer(remaining);
      
      if (remaining === 0 && onRoundBreakComplete) {
        setRoundBreakStartTime(0); // Reset for next round break
        onRoundBreakComplete();
      }
    };

    updateRoundBreakTimer();
    const interval = setInterval(updateRoundBreakTimer, 100);
    return () => {
      clearInterval(interval);
      // Reset on cleanup when leaving roundFinished state
      if (gameState !== 'roundFinished') {
        setRoundBreakStartTime(0);
      }
    };
  }, [gameState, roundBreakStartTime, onRoundBreakComplete]);

  return {
    timer,
    currentQuestionIndex,
  };
}
