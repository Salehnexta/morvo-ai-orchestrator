import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { JourneyProvider } from "@/contexts/JourneyContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import FirstTimeSetup from "./pages/FirstTimeSetup";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import SuccessStories from "./pages/SuccessStories";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import HelpCenter from "./pages/HelpCenter";
import FAQ from "./pages/FAQ";
import Updates from "./pages/Updates";
import Admin from "./pages/Admin";
import ApiSettings from "./pages/admin/ApiSettings";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Billing from "./pages/Billing";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Enhanced retry logic
        if (failureCount >= 3) return false;
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.message.includes('401') || error.message.includes('403')) {
            return false;
          }
        }
        
        return true;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LanguageProvider>
              <ThemeProvider>
                <AuthProvider>
                  <JourneyProvider>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/success-stories" element={<SuccessStories />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/updates" element={<Updates />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/cookies" element={<Cookies />} />

                      {/* Auth Routes */}
                      <Route path="/auth/login" element={<Login />} />
                      <Route path="/auth/register" element={<Register />} />
                      <Route
                        path="/auth/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/auth/reset-password"
                        element={<ResetPassword />}
                      />

                      {/* First Time Setup Route */}
                      <Route
                        path="/first-time-setup"
                        element={
                          <ProtectedRoute>
                            <FirstTimeSetup />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile-setup"
                        element={
                          <ProtectedRoute>
                            <ProfileSetup />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/billing"
                        element={
                          <ProtectedRoute>
                            <Billing />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/payment-success"
                        element={
                          <ProtectedRoute>
                            <PaymentSuccess />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/payment-failed"
                        element={
                          <ProtectedRoute>
                            <PaymentFailed />
                          </ProtectedRoute>
                        }
                      />
                      
                      {/* Admin Routes */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <Admin />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/api-settings"
                        element={
                          <ProtectedRoute>
                            <ApiSettings />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </JourneyProvider>
                </AuthProvider>
              </ThemeProvider>
            </LanguageProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
