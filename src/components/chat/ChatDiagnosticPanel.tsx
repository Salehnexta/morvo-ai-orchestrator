
import React from 'react';

interface ChatDiagnosticPanelProps {
  showDiagnostics: boolean;
  diagnosticResults: any[];
}

export const ChatDiagnosticPanel: React.FC<ChatDiagnosticPanelProps> = ({
  showDiagnostics,
  diagnosticResults
}) => {
  if (!showDiagnostics || diagnosticResults.length === 0) {
    return null;
  }

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="text-sm font-medium mb-2">نتائج التشخيص:</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {diagnosticResults.map((result, i) => (
          <div key={i} className={`p-2 rounded ${
            result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
          }`}>
            <div className="font-medium">{result.format}</div>
            <div className={result.success ? 'text-green-600' : 'text-red-600'}>
              {result.success ? '✅ نجح' : `❌ فشل: ${result.error?.substring(0, 30)}...`}
            </div>
            {result.latency && <div className="text-gray-500">{result.latency}ms</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
