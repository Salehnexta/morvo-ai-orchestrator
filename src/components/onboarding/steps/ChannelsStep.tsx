
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Share2, Facebook, Instagram, Youtube, Mail, Search, Globe } from 'lucide-react';

interface ChannelsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  data: any;
  onDataChange: (data: any) => void;
}

export const ChannelsStep: React.FC<ChannelsStepProps> = ({ onNext, onPrevious, onSkip, data, onDataChange }) => {
  const { language, isRTL } = useLanguage();
  const [selectedChannels, setSelectedChannels] = useState<string[]>(data.channels || []);

  const content = {
    ar: {
      title: 'أين تريد التسويق؟',
      subtitle: 'اختر القنوات التسويقية المفضلة لديك (اختياري)',
      channels: [
        { id: 'social_media', title: 'وسائل التواصل الاجتماعي', description: 'فيسبوك، انستغرام، تويتر', icon: Facebook },
        { id: 'google_ads', title: 'إعلانات جوجل', description: 'البحث والعرض', icon: Search },
        { id: 'email_marketing', title: 'التسويق بالبريد الإلكتروني', description: 'رسائل إخبارية وحملات', icon: Mail },
        { id: 'content_marketing', title: 'تسويق المحتوى', description: 'مدونات وفيديوهات', icon: Globe },
        { id: 'influencer_marketing', title: 'التسويق عبر المؤثرين', description: 'شراكات مع المؤثرين', icon: Instagram },
        { id: 'youtube', title: 'يوتيوب', description: 'إعلانات فيديو', icon: Youtube }
      ],
      next: 'التالي',
      previous: 'السابق',
      skip: 'تخطي',
      optional: 'يمكنك تخطي هذه الخطوة'
    },
    en: {
      title: 'Where do you want to market?',
      subtitle: 'Choose your preferred marketing channels (optional)',
      channels: [
        { id: 'social_media', title: 'Social Media', description: 'Facebook, Instagram, Twitter', icon: Facebook },
        { id: 'google_ads', title: 'Google Ads', description: 'Search and Display', icon: Search },
        { id: 'email_marketing', title: 'Email Marketing', description: 'Newsletters and campaigns', icon: Mail },
        { id: 'content_marketing', title: 'Content Marketing', description: 'Blogs and videos', icon: Globe },
        { id: 'influencer_marketing', title: 'Influencer Marketing', description: 'Partnerships with influencers', icon: Instagram },
        { id: 'youtube', title: 'YouTube', description: 'Video advertising', icon: Youtube }
      ],
      next: 'Next',
      previous: 'Previous',
      skip: 'Skip',
      optional: 'You can skip this step'
    }
  };

  const t = content[language];

  const handleChannelToggle = (channelId: string) => {
    const newChannels = selectedChannels.includes(channelId)
      ? selectedChannels.filter(id => id !== channelId)
      : [...selectedChannels, channelId];
    
    setSelectedChannels(newChannels);
    onDataChange({ channels: newChannels });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-8">
        <Share2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-blue-200">{t.subtitle}</p>
        <p className="text-yellow-400 text-sm mt-2">{t.optional}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {t.channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => handleChannelToggle(channel.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedChannels.includes(channel.id)
                ? 'border-blue-400 bg-blue-500/20 shadow-lg'
                : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className="text-center">
              <channel.icon className={`w-12 h-12 mx-auto mb-3 ${selectedChannels.includes(channel.id) ? 'text-blue-400' : 'text-gray-400'}`} />
              <h3 className={`font-semibold mb-2 ${selectedChannels.includes(channel.id) ? 'text-white' : 'text-gray-300'}`}>
                {channel.title}
              </h3>
              <p className={`text-sm ${selectedChannels.includes(channel.id) ? 'text-blue-200' : 'text-gray-400'}`}>
                {channel.description}
              </p>
              <div className={`w-5 h-5 rounded-full border-2 mx-auto mt-3 flex items-center justify-center ${
                selectedChannels.includes(channel.id)
                  ? 'border-blue-400 bg-blue-400'
                  : 'border-gray-400'
              }`}>
                {selectedChannels.includes(channel.id) && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`flex justify-between pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          onClick={onPrevious}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
          {t.previous}
        </Button>

        <div className="space-x-2">
          {onSkip && (
            <Button
              onClick={onSkip}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t.skip}
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {t.next}
            {isRTL ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
