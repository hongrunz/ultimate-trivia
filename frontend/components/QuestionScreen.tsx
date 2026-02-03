'use client';

import { useState, useEffect } from 'react';
import PlayerHeader from './PlayerHeader';
import {
  GameScreenContainer,
  GameScreenContent,
  GameCard,
  GameHeader,
  CircularBadge,
  QuestionText,
  GameHeaderRow,
  GameRoundLabel,
  GameTimerBadge,
  PlayerGameCardWrapper,
  GameSubmitButton,
} from './styled/GameComponents';
import { OptionsContainer, OptionButton } from './styled/OptionsContainer';
import { MutedText } from './styled/StatusComponents';

interface QuestionScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  currentRound?: number;
  numRounds?: number;
  timer?: number;
  question: string;
  topics?: string[];
  options: string[];
  onSubmit: (answer: string) => void;
}

export default function QuestionScreen({
  currentQuestion,
  totalQuestions,
  currentRound = 1,
  numRounds = 1,
  timer,
  question,
  topics,
  options,
  onSubmit,
}: QuestionScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOptionClick = (option: string) => {
    if (answerSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !answerSubmitted) {
      setAnswerSubmitted(true);
      onSubmit(selectedOption);
    }
  };

  const isDisabled = answerSubmitted;

  const safeOptions = options || [];

  return (
    <GameScreenContainer>
      <PlayerHeader />
      <GameScreenContent>
        <GameHeaderRow>
          <GameRoundLabel>Round {currentRound} of {numRounds}</GameRoundLabel>
          {mounted && timer !== undefined && (
            <GameTimerBadge>{timer}s</GameTimerBadge>
          )}
        </GameHeaderRow>
        <PlayerGameCardWrapper>
          <GameCard>
            <GameHeader>
              <CircularBadge>Question {currentQuestion}/{totalQuestions}</CircularBadge>
            </GameHeader>
            <QuestionText>{question}</QuestionText>
            {safeOptions.length > 0 && (
              <OptionsContainer>
                {safeOptions.map((option, index) => (
                  <OptionButton
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={isDisabled}
                    $selected={selectedOption === option}
                  >
                    {option}
                  </OptionButton>
                ))}
              </OptionsContainer>
            )}
            <GameSubmitButton
              type="button"
              onClick={handleSubmit}
              disabled={selectedOption === null || isDisabled}
            >
              {answerSubmitted ? 'Submitted' : 'Submit'}
            </GameSubmitButton>
            {answerSubmitted && (
              <MutedText style={{ textAlign: 'center', marginTop: '1rem', display: 'block' }}>
                Waiting for other players
              </MutedText>
            )}
          </GameCard>
        </PlayerGameCardWrapper>
      </GameScreenContent>
    </GameScreenContainer>
  );
}
