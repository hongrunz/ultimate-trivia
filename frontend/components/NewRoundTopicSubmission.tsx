'use client';

import { useState } from 'react';
import * as React from 'react';
import PlayerHeader from './PlayerHeader';
import {
  GameScreenContainer,
  GameScreenContent,
  GameCard,
  GameTitle,
  TopicsSection,
  TopicsContainer,
  TopicBadge,
} from './styled/GameComponents';
import { MutedText } from './styled/StatusComponents';
import { Input } from './styled/FormComponents';
import { ButtonPrimary } from './styled/FormComponents';

interface NewRoundTopicSubmissionProps {
  currentRound: number;
  totalRounds: number;
  onSubmitTopic: (topic: string) => Promise<void>;
  collectedTopics?: string[];
  isGeneratingQuestions?: boolean;
}

export default function NewRoundTopicSubmission({
  currentRound,
  totalRounds,
  onSubmitTopic,
  collectedTopics = [],
  isGeneratingQuestions = false,
}: NewRoundTopicSubmissionProps) {
  const [topic, setTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [localTopics, setLocalTopics] = useState<string[]>(collectedTopics || []);

  // Update local topics when collectedTopics prop changes
  React.useEffect(() => {
    if (collectedTopics) {
      setLocalTopics(collectedTopics);
    }
  }, [collectedTopics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim() || isSubmitting || hasSubmitted) return;

    const topicToSubmit = topic.trim();
    
    // Optimistic update: immediately add topic to local state
    setLocalTopics(prev => {
      if (!prev.includes(topicToSubmit)) {
        return [...prev, topicToSubmit];
      }
      return prev;
    });
    setHasSubmitted(true);
    setTopic(''); // Clear input
    
    setIsSubmitting(true);
    try {
      await onSubmitTopic(topicToSubmit);
    } catch (error) {
      console.error('Failed to submit topic:', error);
      // Revert optimistic update on error
      setLocalTopics(prev => prev.filter(t => t !== topicToSubmit));
      setHasSubmitted(false);
      setTopic(topicToSubmit); // Restore topic
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GameScreenContainer>
      <PlayerHeader />
      <GameScreenContent>
        <GameTitle>Round {currentRound} of {totalRounds}</GameTitle>
      <GameCard>
        
        
        {isGeneratingQuestions ? (
          <MutedText style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '2rem' }}>
            Trivi is working hard to generate questions...
          </MutedText>
        ) : (
          <MutedText style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '2rem' }}>
            Submit a new topic for the next round!
          </MutedText>
        )}

        {localTopics.length > 0 && (
          <TopicsSection style={{ marginBottom: '1.5rem' }}>
            <MutedText style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
              Topics submitted so far ({localTopics.length})
            </MutedText>
            <TopicsContainer>
              {localTopics.map((t, index) => (
                <TopicBadge key={`${t}-${index}`}>
                  {t}
                </TopicBadge>
              ))}
            </TopicsContainer>
          </TopicsSection>
        )}

        {isGeneratingQuestions ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem' 
            }}>
              ⚙️
            </div>
            <GameTitle style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Generating Questions...
            </GameTitle>
            <MutedText style={{ fontSize: '1rem' }}>
              Please wait while Trivi creates amazing questions!
            </MutedText>
          </div>
        ) : !hasSubmitted ? (
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter a topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isSubmitting}
              maxLength={50}
              autoFocus
            />
            
            <MutedText style={{ fontSize: '0.85rem', textAlign: 'center', margin: '0.5rem 0 1.5rem' }}>
              Choose something fun and challenging!
            </MutedText>

            <ButtonPrimary 
              type="submit" 
              disabled={!topic.trim() || isSubmitting || hasSubmitted}
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Topic'}
            </ButtonPrimary>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem' 
            }}>
              ✅
            </div>
            <GameTitle style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Topic Submitted!
            </GameTitle>
            <MutedText style={{ fontSize: '1rem' }}>
              Waiting for other players...
            </MutedText>
          </div>
        )}
      </GameCard>
      </GameScreenContent>
    </GameScreenContainer>
  );
}
