'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useVoiceAgent } from './useVoiceAgent';
import { GameContext } from './gameStateMachine';
import { api } from './api';

interface UseGameVoiceAgentOptions {
  enabled?: boolean;
  gameState: string | Record<string, unknown>;
  context: GameContext;
  currentQuestionIndex?: number;
  timer?: number;
}

export function useGameVoiceAgent({
  enabled = true,
  gameState,
  context,
  currentQuestionIndex = 0,
  timer,
}: UseGameVoiceAgentOptions) {
  const { speak, isEnabled, stop, toggleEnabled, availableVoices, selectedVoice, setVoice } = useVoiceAgent({ enabled });
  const previousStateRef = useRef<string>('');
  const previousQuestionIndexRef = useRef<number>(-1);
  const previousTimerRef = useRef<number | undefined>(undefined);
  const hasAnnouncedQuestionRef = useRef<boolean>(false);
  const hasAnnouncedStartRef = useRef<boolean>(false);

  // Helper function to generate and speak LLM commentary
  const speakCommentary = useCallback(async (
    eventType: string,
    context: Record<string, unknown>,
    fallback: string
  ) => {
    try {
      const commentary = await api.getVoiceCommentary(eventType, context);
      if (commentary && commentary.trim()) {
        await speak(commentary);
      } else {
        await speak(fallback);
      }
    } catch (error) {
      console.error('Failed to generate commentary, using fallback:', error);
      // Try to speak fallback, but don't fail if TTS is unavailable
      try {
        await speak(fallback);
      } catch (ttsError) {
        console.error('TTS also failed:', ttsError);
      }
    }
  }, [speak]);

  // Reset question announcement flag when question changes
  useEffect(() => {
    if (currentQuestionIndex !== previousQuestionIndexRef.current) {
      hasAnnouncedQuestionRef.current = false;
      previousQuestionIndexRef.current = currentQuestionIndex;
    }
  }, [currentQuestionIndex]);

  // Announce question when question index changes (even if state hasn't changed)
  useEffect(() => {
    if (!isEnabled) return;
    if (typeof gameState === 'string' && gameState !== 'question') return;
    if (hasAnnouncedQuestionRef.current) return;
    if (!context.room?.questions || !context.room.questions[currentQuestionIndex]) return;

    const question = context.room.questions[currentQuestionIndex];
    const questionNum = currentQuestionIndex + 1;
    const totalQuestions = context.room.questionsPerRound;
    
    // If this is the first question (index 0) and we haven't announced start yet, wait a bit
    // to let the welcome message play first
    const delay = currentQuestionIndex === 0 && !hasAnnouncedStartRef.current ? 3000 : 0;
    
    setTimeout(() => {
      // Generate and speak question introduction with LLM
      speakCommentary('question_intro', {
        questionNum,
        totalQuestions,
        question: question.question,
        topics: question.topics || [],
        round: context.room?.currentRound || 1,
        totalRounds: context.room?.numRounds || 1,
      }, `Question ${questionNum} of ${totalQuestions}. ${question.question}`).then(() => {
        // Announce options after a brief pause
        setTimeout(() => {
          if (question.options && question.options.length > 0) {
            const optionsText = question.options
              .map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`)
              .join('. ');
            speak(`Options: ${optionsText}`);
          }
        }, 2000);
      });
    }, delay);
    
    hasAnnouncedQuestionRef.current = true;
  }, [currentQuestionIndex, gameState, context.room?.questions, isEnabled, speakCommentary, context.room, speak]);

  // Handle state transitions
  useEffect(() => {
    if (!isEnabled) return;

    const currentState = typeof gameState === 'string' ? gameState : 'unknown';
    const previousState = previousStateRef.current;

    // Only speak on state transitions
    if (currentState === previousState) return;

    previousStateRef.current = currentState;

    // Stop any ongoing speech when state changes
    stop();

    // Small delay to ensure clean transition
    const timeout = setTimeout(() => {
      switch (currentState) {
        case 'question':
          // Announce question when entering question state
          if (context.room?.questions && context.room.questions[currentQuestionIndex]) {
            const question = context.room.questions[currentQuestionIndex];
            const questionNum = currentQuestionIndex + 1;
            const totalQuestions = context.room.questionsPerRound;
            
            // Generate and speak question introduction with LLM
            speakCommentary('question_intro', {
              questionNum,
              totalQuestions,
              question: question.question,
              topics: question.topics || [],
              round: context.room?.currentRound || 1,
              totalRounds: context.room?.numRounds || 1,
            }, `Question ${questionNum} of ${totalQuestions}. ${question.question}`).then(() => {
              // Announce options after a brief pause
              setTimeout(() => {
                if (question.options && question.options.length > 0) {
                  const optionsText = question.options
                    .map((opt, idx) => `${String.fromCharCode(65 + idx)}: ${opt}`)
                    .join('. ');
                  speak(`Options: ${optionsText}`);
                }
              }, 2000);
            });
            
            hasAnnouncedQuestionRef.current = true;
          }
          break;

        case 'submitted':
          // Announce that time is up and show answer
          if (context.room?.questions && context.room.questions[currentQuestionIndex]) {
            const question = context.room.questions[currentQuestionIndex];
            const correctOption = question.options[question.correctAnswer];
            const optionLetter = String.fromCharCode(65 + question.correctAnswer);
            
            setTimeout(() => {
              speakCommentary('answer_reveal', {
                question: question.question,
                correctAnswer: correctOption,
                optionLetter,
                questionNum: currentQuestionIndex + 1,
                topics: question.topics || [],
              }, `Time's up! The correct answer is ${optionLetter}: ${correctOption}.`).then(() => {
                // Announce explanation if available
                if (question.explanation) {
                  setTimeout(() => {
                    speakCommentary('explanation', {
                      question: question.question,
                      correctAnswer: correctOption,
                      explanation: question.explanation,
                      topics: question.topics || [],
                    }, `Explanation: ${question.explanation}`);
                  }, 3000);
                }
              });
            }, 500);
          }
          break;

        case 'roundFinished':
          // Announce round completion
          if (context.room) {
            const round = context.room.currentRound;
            const totalRounds = context.room.numRounds;
            
            setTimeout(() => {
              const topThree = context.leaderboard && context.leaderboard.length > 0
                ? context.leaderboard.slice(0, 3).map((entry, idx) => ({
                    position: idx === 0 ? 'first' : idx === 1 ? 'second' : 'third',
                    name: entry.playerName,
                    points: entry.points,
                  }))
                : [];
              
              speakCommentary('round_complete', {
                round,
                totalRounds,
                leaderboard: topThree,
                totalPlayers: context.room?.players.length || 0,
              }, `Round ${round} complete!`);
            }, 500);
          }
          break;

        case 'newRound':
          // Announce new round
          if (context.room) {
            const nextRound = (context.room.currentRound || 0) + 1;
            const totalRounds = context.room.numRounds || 1;
            
            setTimeout(() => {
              speakCommentary('new_round', {
                nextRound,
                totalRounds,
                previousRound: context.room?.currentRound || 0,
              }, `Get ready for round ${nextRound} of ${totalRounds}!`);
            }, 500);
          }
          break;

        case 'finished':
          // Announce game completion
          setTimeout(() => {
            const winner = context.leaderboard && context.leaderboard.length > 0
              ? context.leaderboard[0]
              : null;
            
            speakCommentary('game_over', {
              winner: winner ? {
                name: winner.playerName,
                points: winner.points,
              } : null,
              totalRounds: context.room?.numRounds || 1,
              totalPlayers: context.room?.players.length || 0,
            }, winner 
              ? `Game over! Congratulations to ${winner.playerName} for winning with ${winner.points} ${winner.points === 1 ? 'point' : 'points'}!`
              : 'Game over!');
          }, 500);
          break;
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [gameState, context, currentQuestionIndex, isEnabled, speak, stop, speakCommentary]);

  // Announce timer warnings (10 seconds, 5 seconds)
  useEffect(() => {
    if (!isEnabled || gameState !== 'question') return;
    if (timer === undefined) return;

    if (timer === 10 && previousTimerRef.current !== 10) {
      setTimeout(() => {
        speakCommentary('timer_warning', {
          seconds: 10,
          questionNum: currentQuestionIndex + 1,
        }, '10 seconds remaining');
      }, 500);
    } else if (timer === 5 && previousTimerRef.current !== 5) {
      setTimeout(() => {
        speakCommentary('timer_warning', {
          seconds: 5,
          questionNum: currentQuestionIndex + 1,
        }, '5 seconds remaining');
      }, 500);
    }

    previousTimerRef.current = timer;
  }, [timer, gameState, isEnabled, speakCommentary, currentQuestionIndex]);

  // Announce game start (only once when game first starts)
  useEffect(() => {
    if (!isEnabled) return;
    if (!context.room || context.room.status !== 'started') return;
    if (hasAnnouncedStartRef.current) return;
    if (!context.room.questions || context.room.questions.length === 0) return;
    if (typeof gameState === 'string' && gameState !== 'question') return; // Wait until we're in question state

    hasAnnouncedStartRef.current = true;
    const round = context.room?.currentRound || 1;
    const totalRounds = context.room?.numRounds || 1;
    speakCommentary('welcome', {
      round,
      totalRounds,
      totalPlayers: context.room?.players.length || 0,
      gameName: 'Ultimate Trivia',
    }, `Welcome to Ultimate Trivia! Round ${round} of ${totalRounds} is about to begin.`);
  }, [context.room, gameState, isEnabled, speakCommentary]);

  return {
    isEnabled,
    stop,
    toggleEnabled,
    availableVoices,
    selectedVoice,
    setVoice,
  };
}
