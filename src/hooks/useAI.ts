import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { AIResponse, Avatar, KarmaAction } from '../types';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSpiritualGuidance = useCallback(async (
    question: string, 
    avatar: Avatar | null
  ): Promise<AIResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.getSpiritualGuidance(question, avatar);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get spiritual guidance');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeKarmaPattern = useCallback(async (
    karmaHistory: KarmaAction[]
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await aiService.analyzeKarmaPattern(karmaHistory);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze karma pattern');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRemainingRequests = useCallback(() => {
    return aiService.getRemainingRequests();
  }, []);

  return {
    getSpiritualGuidance,
    analyzeKarmaPattern,
    getRemainingRequests,
    isLoading,
    error
  };
};