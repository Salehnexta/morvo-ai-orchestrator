
import { MessageSquare, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  onStartChat: () => void;
}

export const Header = ({ onStartChat }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center`}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Morvo AI
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Next-Gen Marketing Intelligence
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`${theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Button
              onClick={onStartChat}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              تجربة مجانية | Try Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
