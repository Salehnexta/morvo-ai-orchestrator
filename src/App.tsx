
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/layouts/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PublicChat from "./pages/PublicChat";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import Billing from "./pages/Billing";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import HelpCenter from "./pages/HelpCenter";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import SuccessStories from "./pages/SuccessStories";
import Updates from "./pages/Updates";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ApiSettings from "./pages/admin/ApiSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth routes without layout */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes without main layout */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              
              {/* Public chat without main layout to avoid double header */}
              <Route path="/public-chat" element={<PublicChat />} />
              
              {/* All other routes with main layout */}
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
              <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
              <Route path="/support" element={<MainLayout><Support /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/billing" element={<MainLayout><Billing /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
              <Route path="/payment-success" element={<MainLayout><PaymentSuccess /></MainLayout>} />
              <Route path="/payment-failed" element={<MainLayout><PaymentFailed /></MainLayout>} />
              <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} />
              <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
              <Route path="/cookies" element={<MainLayout><Cookies /></MainLayout>} />
              <Route path="/help" element={<MainLayout><HelpCenter /></MainLayout>} />
              <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
              <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
              <Route path="/success-stories" element={<MainLayout><SuccessStories /></MainLayout>} />
              <Route path="/updates" element={<MainLayout><Updates /></MainLayout>} />
              <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
              <Route path="/admin/api-settings" element={<MainLayout><ApiSettings /></MainLayout>} />
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
