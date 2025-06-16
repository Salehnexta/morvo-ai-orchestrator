
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onStartChat={handleStartChat} />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer is now handled by individual pages */}
    </div>
  );
};
