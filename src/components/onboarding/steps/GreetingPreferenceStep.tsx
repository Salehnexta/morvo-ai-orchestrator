
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Edit3 } from 'lucide-react';

interface GreetingPreferenceStepProps {
  onComplete: (greeting: string) => void;
  loading?: boolean;
  currentGreeting?: string;
}

export const GreetingPreferenceStep: React.FC<GreetingPreferenceStepProps> = ({ 
  onComplete, 
  loading = false,
  currentGreeting = 'أستاذ'
}) => {
  const [selectedGreeting, setSelectedGreeting] = useState(currentGreeting);
  const [customGreeting, setCustomGreeting] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const greetingOptions = [
    { value: 'أستاذ', label: 'أستاذ' },
    { value: 'أستاذة', label: 'أستاذة' },
    { value: 'دكتور', label: 'دكتور' },
    { value: 'دكتورة', label: 'دكتورة' },
    { value: 'مهندس', label: 'مهندس' },
    { value: 'مهندسة', label: 'مهندسة' },
    { value: 'أبو', label: 'أبو' },
    { value: 'أم', label: 'أم' },
    { value: 'الاسم فقط', label: 'الاسم فقط' },
    { value: 'مدير', label: 'مدير' },
    { value: 'مديرة', label: 'مديرة' },
    { value: 'custom', label: 'خيار مخصص' }
  ];

  const handleGreetingChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      setSelectedGreeting('');
    } else {
      setShowCustomInput(false);
      setSelectedGreeting(value);
      setCustomGreeting('');
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomGreeting(value);
    setSelectedGreeting(value);
  };

  const handleSubmit = () => {
    const finalGreeting = showCustomInput ? customGreeting.trim() : selectedGreeting;
    if (finalGreeting) {
      onComplete(finalGreeting);
    }
  };

  const isValid = showCustomInput ? customGreeting.trim().length > 0 : selectedGreeting.length > 0;

  return (
    <Card className="bg-gray-800/95 border-gray-600/50 shadow-xl max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-center justify-center">
          <User className="w-5 h-5 text-blue-400" />
          كيف تفضل أن أناديك؟
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-200 text-center">
          اختر الطريقة التي تفضل أن أخاطبك بها في جميع محادثاتنا المستقبلية
        </p>
        
        <div className="space-y-4">
          <Label className="text-white font-medium">اختر طريقة المخاطبة المفضلة:</Label>
          
          <RadioGroup 
            value={showCustomInput ? 'custom' : selectedGreeting} 
            onValueChange={handleGreetingChange}
            className="grid grid-cols-2 gap-3"
          >
            {greetingOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value}
                  className="border-gray-500 text-blue-400"
                />
                <Label 
                  htmlFor={option.value} 
                  className="text-gray-200 cursor-pointer hover:text-white transition-colors flex items-center gap-2"
                >
                  {option.value === 'custom' && <Edit3 className="w-4 h-4" />}
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showCustomInput && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="custom-greeting" className="text-white font-medium">
                أدخل الطريقة المفضلة:
              </Label>
              <Input
                id="custom-greeting"
                value={customGreeting}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                placeholder="مثال: الأستاذ الفاضل، سيدي، etc..."
                className="bg-gray-700/80 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                dir="rtl"
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التفضيل والمتابعة'}
        </Button>
      </CardContent>
    </Card>
  );
};
