
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileService } from '@/services/userProfileService';

interface ConversationalMemory {
  memories: Array<{
    type: string;
    content: string;
    importance: number;
    timestamp: string;
    accessCount: number;
  }>;
  emotionalContext: {
    currentMood: string;
    engagementLevel: number;
    frustrationLevel: number;
    satisfactionScore: number;
  };
  conversationFlow: {
    currentTopic: string;
    topicHistory: string[];
    contextSwitches: number;
    averageResponseTime: number;
  };
}

export const useConversationalMemory = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<ConversationalMemory>({
    memories: [],
    emotionalContext: {
      currentMood: 'neutral',
      engagementLevel: 0.5,
      frustrationLevel: 0,
      satisfactionScore: 0.5
    },
    conversationFlow: {
      currentTopic: 'general',
      topicHistory: [],
      contextSwitches: 0,
      averageResponseTime: 0
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Load user profile data as conversation memory
  useEffect(() => {
    const loadMemories = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userProfile = await UserProfileService.getUserProfile(user.id);
        
        if (userProfile) {
          // Transform user profile data into conversational memory format
          const profileMemories = [];
          
          if (userProfile.company_name) {
            profileMemories.push({
              type: 'business_identity',
              content: `Company: ${userProfile.company_name}`,
              importance: 0.9,
              timestamp: userProfile.created_at || new Date().toISOString(),
              accessCount: 1
            });
          }
          
          if (userProfile.industry) {
            profileMemories.push({
              type: 'business_context',
              content: `Industry: ${userProfile.industry}`,
              importance: 0.8,
              timestamp: userProfile.created_at || new Date().toISOString(),
              accessCount: 1
            });
          }
          
          if (userProfile.marketing_experience) {
            profileMemories.push({
              type: 'experience_level',
              content: `Marketing Experience: ${userProfile.marketing_experience}`,
              importance: 0.7,
              timestamp: userProfile.created_at || new Date().toISOString(),
              accessCount: 1
            });
          }

          setMemories(prev => ({
            ...prev,
            memories: profileMemories
          }));
        }
      } catch (error) {
        console.error('Error loading conversational memories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, [user]);

  const addMemory = async (type: string, content: string, importance: number = 0.5) => {
    const newMemory = {
      type,
      content,
      importance,
      timestamp: new Date().toISOString(),
      accessCount: 1
    };

    setMemories(prev => ({
      ...prev,
      memories: [newMemory, ...prev.memories].slice(0, 50) // Keep only latest 50 memories
    }));
  };

  const updateEmotionalContext = (updates: Partial<ConversationalMemory['emotionalContext']>) => {
    setMemories(prev => ({
      ...prev,
      emotionalContext: {
        ...prev.emotionalContext,
        ...updates
      }
    }));
  };

  const updateConversationFlow = (updates: Partial<ConversationalMemory['conversationFlow']>) => {
    setMemories(prev => ({
      ...prev,
      conversationFlow: {
        ...prev.conversationFlow,
        ...updates
      }
    }));
  };

  const getRelevantMemories = (query: string, limit: number = 5) => {
    return memories.memories
      .filter(memory => 
        memory.content.toLowerCase().includes(query.toLowerCase()) ||
        memory.type.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  };

  const getContextualSummary = () => {
    const recentMemories = memories.memories.slice(0, 10);
    const topics = [...new Set(recentMemories.map(m => m.type))];
    
    return {
      recentTopics: topics,
      totalMemories: memories.memories.length,
      averageImportance: memories.memories.reduce((sum, m) => sum + m.importance, 0) / memories.memories.length || 0,
      emotionalState: memories.emotionalContext,
      conversationState: memories.conversationFlow
    };
  };

  return {
    memories: memories.memories,
    emotionalContext: memories.emotionalContext,
    conversationFlow: memories.conversationFlow,
    loading,
    addMemory,
    updateEmotionalContext,
    updateConversationFlow,
    getRelevantMemories,
    getContextualSummary
  };
};
