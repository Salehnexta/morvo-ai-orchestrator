
import React from 'react';

interface ConnectionStatusProps {
  isConnecting: boolean;
  theme: 'light' | 'dark';
  content: {
    connecting: string;
    connected: string;
  };
}

export const ConnectionStatus = ({ isConnecting, theme, content }: ConnectionStatusProps) => {
  return (
    <div className={`flex items-center gap-2`}>
      <div className={`w-2 h-2 rounded-full animate-pulse ${
        isConnecting ? 'bg-yellow-500' : 'bg-green-500'
      }`}></div>
      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {isConnecting ? content.connecting : content.connected}
      </span>
    </div>
  );
};
