
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Globe, AlertCircle } from 'lucide-react';

interface WebsiteUrlInputProps {
  websiteUrl: string;
  onUrlChange: (url: string) => void;
  onAnalyze: () => void;
  onSkip: () => void;
  error?: string;
  isAnalyzing: boolean;
  content: {
    title: string;
    subtitle: string;
    urlLabel: string;
    urlPlaceholder: string;
    analyzeButton: string;
    skipButton: string;
    invalidUrl: string;
  };
}

export const WebsiteUrlInput: React.FC<WebsiteUrlInputProps> = ({
  websiteUrl,
  onUrlChange,
  onAnalyze,
  onSkip,
  error,
  isAnalyzing,
  content
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Globe className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
        <p className="text-gray-600">{content.subtitle}</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="website-url">{content.urlLabel}</Label>
          <Input
            id="website-url"
            type="url"
            placeholder={content.urlPlaceholder}
            value={websiteUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            className="mt-1"
          />
          {error && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onAnalyze}
            disabled={!websiteUrl.trim() || isAnalyzing}
            className="w-full"
          >
            <Globe className="w-4 h-4 mr-2" />
            {content.analyzeButton}
          </Button>
          
          <Button
            onClick={onSkip}
            variant="outline"
            className="w-full"
          >
            {content.skipButton}
          </Button>
        </div>
      </div>
    </div>
  );
};
