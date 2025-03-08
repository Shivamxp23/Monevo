import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import Index from "./pages/Index";
import CourseContent from "./pages/CourseContent";
import { AuthForm } from "./components/auth/AuthForm";
import { StrictMode } from "react";
import { LogOut } from "lucide-react";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();

  return (
    <div>
      {user && (
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
      {children}
    </div>
  );
};

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <TooltipProvider>
              <Layout>
                <Routes>
                  <Route path="/auth" element={<AuthForm />} />
                  <Route
                    path="/register"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:courseId"
                    element={
                      <ProtectedRoute>
                        <CourseContent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:courseId/:chapterId"
                    element={
                      <ProtectedRoute>
                        <CourseContent />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/register" replace />} />
                </Routes>
              </Layout>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

export default App;