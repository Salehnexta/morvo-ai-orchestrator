import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart3, PenTool, Calendar, Target, Play, Edit, Share2, TrendingUp } from "lucide-react";

interface ActionButtonsProps {
  messageContent: string;
  language: string;
  theme: 'light' | 'dark';
  isRTL: boolean;
  onActionClick: (action: string, prompt: string) => void;
}

export const ActionButtons = ({ 
  messageContent, 
  language, 
  theme, 
  isRTL, 
  onActionClick 
}: ActionButtonsProps) => {
  const lowerContent = messageContent.toLowerCase();
  const isArabic = language === 'ar';
  
  // Determine which actions to show based on message content
  const getRelevantActions = () => {
    const actions = [];
    
    // Analytics actions
    if (lowerContent.includes('performance') || lowerContent.includes('analytics') || 
        lowerContent.includes('metrics') || lowerContent.includes('أداء') || 
        lowerContent.includes('تحليلات')) {
      actions.push({
        key: 'view-analytics',
        icon: BarChart3,
        label: isArabic ? 'عرض التحليلات' : 'View Analytics',
        prompt: isArabic ? 'أرني لوحة التحليلات التفصيلية' : 'Show me detailed analytics dashboard'
      });
      actions.push({
        key: 'roi-analysis',
        icon: TrendingUp,
        label: isArabic ? 'تحليل العائد' : 'ROI Analysis',
        prompt: isArabic ? 'حلل العائد على الاستثمار لحملاتي' : 'Analyze ROI for my campaigns'
      });
    }
    
    // Content creation actions
    if (lowerContent.includes('content') || lowerContent.includes('post') || 
        lowerContent.includes('write') || lowerContent.includes('محتوى') || 
        lowerContent.includes('منشور')) {
      actions.push({
        key: 'create-content',
        icon: PenTool,
        label: isArabic ? 'إنشاء محتوى' : 'Create Content',
        prompt: isArabic ? 'أنشئ محتوى جديد لوسائل التواصل' : 'Create new social media content'
      });
      actions.push({
        key: 'edit-content',
        icon: Edit,
        label: isArabic ? 'تحرير المحتوى' : 'Edit Content',
        prompt: isArabic ? 'أرني المحتوى المسودة للتحرير' : 'Show me draft content for editing'
      });
    }
    
    // Campaign actions
    if (lowerContent.includes('campaign') || lowerContent.includes('ad') || 
        lowerContent.includes('launch') || lowerContent.includes('حملة') || 
        lowerContent.includes('إعلان')) {
      actions.push({
        key: 'create-campaign',
        icon: Target,
        label: isArabic ? 'إنشاء حملة' : 'Create Campaign',
        prompt: isArabic ? 'أنشئ حملة إعلانية جديدة' : 'Create a new advertising campaign'
      });
      actions.push({
        key: 'launch-campaign',
        icon: Play,
        label: isArabic ? 'إطلاق الحملة' : 'Launch Campaign',
        prompt: isArabic ? 'أطلق الحملة الجاهزة' : 'Launch the ready campaign'
      });
    }
    
    // Scheduling actions
    if (lowerContent.includes('schedule') || lowerContent.includes('calendar') || 
        lowerContent.includes('plan') || lowerContent.includes('جدولة') || 
        lowerContent.includes('تقويم')) {
      actions.push({
        key: 'schedule-content',
        icon: Calendar,
        label: isArabic ? 'جدولة المحتوى' : 'Schedule Content',
        prompt: isArabic ? 'أرني تقويم المحتوى وجدولة منشورات جديدة' : 'Show me content calendar and schedule new posts'
      });
      actions.push({
        key: 'view-calendar',
        icon: Calendar,
        label: isArabic ? 'عرض التقويم' : 'View Calendar',
        prompt: isArabic ? 'أرني التقويم الشهري للمحتوى' : 'Show me monthly content calendar'
      });
    }
    
    return actions;
  };
  
  const actions = getRelevantActions();
  
  if (actions.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 mt-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.key}
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action.key, action.prompt)}
            className={`
              backdrop-blur-sm transition-all duration-200 hover:scale-105
              ${theme === 'dark' 
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                : 'bg-black/10 border-gray-300 text-gray-700 hover:bg-black/20'
              }
            `}
          >
            <Icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}; 