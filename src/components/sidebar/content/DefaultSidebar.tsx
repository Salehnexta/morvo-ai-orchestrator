
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface DefaultSidebarProps {
  onActionClick?: (action: string) => void;
}

export const DefaultSidebar: React.FC<DefaultSidebarProps> = ({ onActionClick }) => {
  const { language } = useLanguage();

  return (
    <div className="h-full bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=800&fit=crop" 
          alt="AI Marketing"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-sm">
          <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {language === 'ar' ? 'جاهز للمساعدة' : 'Ready to Assist'}
          </h3>
          <p className="text-blue-200 mb-4 text-sm">
            {language === 'ar' 
              ? 'ابدأ محادثة وسأعرض المحتوى المناسب هنا'
              : 'Start a conversation and I\'ll show relevant content here'
            }
          </p>
          <Badge variant="outline" className="text-blue-300 border-blue-400/50">
            {language === 'ar' ? 'مورفو الذكي' : 'Morvo AI'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
