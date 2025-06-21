
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Globe, CheckCircle, XCircle } from 'lucide-react';
import { MorvoAIService } from '@/services/morvoAIService';

export const PerplexityTest: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testPerplexityAPI = async () => {
    setIsAnalyzing(true);
    setError('');
    setResults(null);

    try {
      console.log('🧪 Testing Perplexity API with nexta.sa');
      
      const response = await MorvoAIService.makeRequest('/onboarding/website-analysis', {
        method: 'POST',
        body: JSON.stringify({
          journey_id: crypto.randomUUID(),
          website_url: 'https://nexta.sa',
          business_type: 'technology'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Perplexity API Response:', data);
      setResults(data);
      
    } catch (error) {
      console.error('❌ Perplexity API Test Failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Perplexity API Test - nexta.sa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testPerplexityAPI}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing nexta.sa...
              </>
            ) : (
              'Test Perplexity API'
            )}
          </Button>

          {error && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Error:</span>
                </div>
                <p className="text-red-600 mt-2">{error}</p>
              </CardContent>
            </Card>
          )}

          {results && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
