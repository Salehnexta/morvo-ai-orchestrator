
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { JourneyFlowService, JourneyPhase } from '@/services/journeyFlowService';

interface JourneyProgressProps {
  currentPhase: string;
  completedPhases: string[];
  progress: number;
  estimatedTimeRemaining?: number;
  className?: string;
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  currentPhase,
  completedPhases,
  progress,
  estimatedTimeRemaining,
  className = ''
}) => {
  const allPhases = JourneyFlowService.getAllPhases();
  const currentPhaseData = JourneyFlowService.getPhase(currentPhase);

  const getPhaseStatus = (phase: JourneyPhase) => {
    if (completedPhases.includes(phase.id)) {
      return 'completed';
    } else if (phase.id === currentPhase) {
      return 'current';
    } else {
      return 'available';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'current':
        return <Circle className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'locked':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className={`bg-white/10 backdrop-blur-sm border-white/20 ${className}`}>
      <CardContent className="p-6">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">تقدم الرحلة التسويقية</h3>
            <Badge variant="outline" className="text-white border-white/30">
              {progress}%
            </Badge>
          </div>
          <Progress value={progress} className="h-3 bg-white/20" />
          
          {estimatedTimeRemaining && (
            <div className="flex items-center gap-2 text-sm text-blue-200 mt-2">
              <Clock className="w-4 h-4" />
              <span>الوقت المتبقي المقدر: {estimatedTimeRemaining} دقيقة</span>
            </div>
          )}
        </div>

        {/* Current Phase Info */}
        {currentPhaseData && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <h4 className="font-semibold text-white mb-1">{currentPhaseData.title}</h4>
            <p className="text-blue-200 text-sm mb-2">{currentPhaseData.description}</p>
            <div className="flex items-center gap-2 text-xs text-blue-300">
              <Clock className="w-3 h-3" />
              <span>المدة المقدرة: {currentPhaseData.estimatedTime} دقائق</span>
            </div>
          </div>
        )}

        {/* Phase List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/90 mb-3">مراحل الرحلة</h4>
          {allPhases.map((phase, index) => {
            const status = getPhaseStatus(phase);
            return (
              <div
                key={phase.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${getStatusColor(status)}`}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{phase.title}</span>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      مطلوب
                    </Badge>
                  </div>
                  <p className="text-xs opacity-75 mt-1">{phase.description}</p>
                </div>
                <div className="text-xs opacity-60">
                  {phase.estimatedTime}د
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
