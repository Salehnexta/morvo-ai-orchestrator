
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationMemory {
  id: string;
  type: 'preference' | 'context' | 'achievement' | 'goal' | 'behavior';
  content: any;
  importance: number;
  lastAccessed: Date;
  accessCount: number;
}

interface EmotionalContext {
  currentEmotion: string;
  confidence: number;
  triggers: string[];
  adaptationStrategy: string;
  satisfactionLevel: number;
}

export const useConversationalMemory = () => {
  const [memories, setMemories] = useState<ConversationMemory[]>([]);
  const [emotionalContext, setEmotionalContext] = useState<EmotionalContext>({
    currentEmotion: 'neutral',
    confidence: 0.7,
    triggers: [],
    adaptationStrategy: 'supportive',
    satisfactionLevel: 0.8
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadMemories = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Get client ID first
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return;

      // Load agent memories
      const { data: memoriesData, error } = await supabase
        .from('agent_memories')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('agent_id', 'morvo-ai')
        .order('importance', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading memories:', error);
        return;
      }

      const formattedMemories: ConversationMemory[] = memoriesData.map(memory => ({
        id: memory.id,
        type: memory.memory_type as any,
        content: memory.content,
        importance: memory.importance || 5,
        lastAccessed: new Date(memory.last_accessed_at || memory.created_at),
        accessCount: memory.access_count || 0
      }));

      setMemories(formattedMemories);
    } catch (error) {
      console.error('Error in loadMemories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const saveMemory = useCallback(async (
    type: ConversationMemory['type'],
    content: any,
    importance: number = 5
  ) => {
    if (!user?.id) return false;

    try {
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) return false;

      const { error } = await supabase
        .from('agent_memories')
        .insert({
          client_id: clientData.id,
          agent_id: 'morvo-ai',
          memory_type: type,
          content: content,
          importance: importance,
          access_count: 0,
          last_accessed_at: new Date().toISOString()
        });

      if (!error) {
        // Update local state
        const newMemory: ConversationMemory = {
          id: Date.now().toString(),
          type,
          content,
          importance,
          lastAccessed: new Date(),
          accessCount: 0
        };
        
        setMemories(prev => [newMemory, ...prev].slice(0, 50));
        return true;
      }
    } catch (error) {
      console.error('Error saving memory:', error);
    }
    
    return false;
  }, [user?.id]);

  const updateEmotionalContext = useCallback(async (
    emotion: string,
    confidence: number,
    triggers: string[] = [],
    message?: string
  ) => {
    if (!user?.id) return;

    // Determine adaptation strategy based on emotion
    let adaptationStrategy = 'supportive';
    let satisfactionLevel = emotionalContext.satisfactionLevel;

    switch (emotion.toLowerCase()) {
      case 'frustrated':
      case 'angry':
        adaptationStrategy = 'calming';
        satisfactionLevel = Math.max(0.3, satisfactionLevel - 0.2);
        break;
      case 'confused':
        adaptationStrategy = 'explanatory';
        satisfactionLevel = Math.max(0.4, satisfactionLevel - 0.1);
        break;
      case 'excited':
      case 'happy':
        adaptationStrategy = 'encouraging';
        satisfactionLevel = Math.min(1.0, satisfactionLevel + 0.1);
        break;
      case 'worried':
      case 'anxious':
        adaptationStrategy = 'reassuring';
        break;
      default:
        adaptationStrategy = 'supportive';
    }

    const newContext: EmotionalContext = {
      currentEmotion: emotion,
      confidence,
      triggers,
      adaptationStrategy,
      satisfactionLevel
    };

    setEmotionalContext(newContext);

    // Save emotional context to database
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (clientData) {
        await supabase
          .from('emotional_contexts')
          .insert({
            client_id: clientData.id,
            primary_emotion: emotion,
            confidence,
            detected_triggers: triggers,
            adaptation_strategy: adaptationStrategy,
            emotional_intensity: confidence,
            context_data: { message, satisfactionLevel }
          });
      }
    } catch (error) {
      console.error('Error saving emotional context:', error);
    }
  }, [user?.id, emotionalContext.satisfactionLevel]);

  const getRelevantMemories = useCallback((
    context: string,
    limit: number = 5
  ): ConversationMemory[] => {
    const contextLower = context.toLowerCase();
    
    return memories
      .filter(memory => {
        if (typeof memory.content === 'string') {
          return memory.content.toLowerCase().includes(contextLower);
        }
        if (typeof memory.content === 'object') {
          return JSON.stringify(memory.content).toLowerCase().includes(contextLower);
        }
        return false;
      })
      .sort((a, b) => {
        // Sort by importance and recency
        const importanceWeight = (b.importance - a.importance) * 0.7;
        const recencyWeight = (b.lastAccessed.getTime() - a.lastAccessed.getTime()) * 0.3;
        return importanceWeight + recencyWeight;
      })
      .slice(0, limit);
  }, [memories]);

  const analyzeMessageEmotion = useCallback((message: string): {
    emotion: string;
    confidence: number;
    triggers: string[];
  } => {
    const messageLower = message.toLowerCase();
    
    // Simple emotion detection based on keywords
    const emotionPatterns = {
      frustrated: ['محبط', 'مزعج', 'صعب', 'مشكلة', 'خطأ', 'frustrated', 'annoying', 'difficult'],
      excited: ['رائع', 'ممتاز', 'مذهل', 'سعيد', 'excited', 'amazing', 'great', 'awesome'],
      confused: ['لا أفهم', 'مربك', 'غامض', 'confused', 'unclear', 'complicated'],
      worried: ['قلق', 'خائف', 'مخاوف', 'worried', 'concerned', 'afraid'],
      satisfied: ['شكرا', 'ممتن', 'راضي', 'thanks', 'grateful', 'satisfied']
    };

    let detectedEmotion = 'neutral';
    let confidence = 0.5;
    const triggers: string[] = [];

    for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
      const matchedPatterns = patterns.filter(pattern => 
        messageLower.includes(pattern.toLowerCase())
      );
      
      if (matchedPatterns.length > 0) {
        detectedEmotion = emotion;
        confidence = Math.min(0.9, 0.6 + (matchedPatterns.length * 0.1));
        triggers.push(...matchedPatterns);
        break;
      }
    }

    return { emotion: detectedEmotion, confidence, triggers };
  }, []);

  const getPersonalizedResponse = useCallback((baseResponse: string): string => {
    const { adaptationStrategy, currentEmotion, satisfactionLevel } = emotionalContext;
    
    let personalizedResponse = baseResponse;

    // Add emotional adaptation
    switch (adaptationStrategy) {
      case 'calming':
        personalizedResponse = `أفهم شعورك، دعني أساعدك بهدوء. ${baseResponse}`;
        break;
      case 'encouraging':
        personalizedResponse = `رائع! حماسك يشجعني. ${baseResponse}`;
        break;
      case 'explanatory':
        personalizedResponse = `دعني أوضح الأمر بطريقة مبسطة. ${baseResponse}`;
        break;
      case 'reassuring':
        personalizedResponse = `لا تقلق، سنحل هذا معاً. ${baseResponse}`;
        break;
    }

    // Add satisfaction-based adjustments
    if (satisfactionLevel < 0.5) {
      personalizedResponse += '\n\nهل تحتاج مني توضيح أكثر أو مساعدة إضافية؟';
    }

    return personalizedResponse;
  }, [emotionalContext]);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  return {
    memories,
    emotionalContext,
    isLoading,
    saveMemory,
    updateEmotionalContext,
    getRelevantMemories,
    analyzeMessageEmotion,
    getPersonalizedResponse,
    loadMemories
  };
};
