
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateTest from "./pages/dashboard/CreateTest";
import AddCandidates from "./pages/dashboard/AddCandidates";
import Submissions from "./pages/dashboard/Submissions";
import TestManagement from "./pages/dashboard/TestManagement";
import Settings from "./pages/dashboard/Settings";
import InterviewWorkspace from "./pages/InterviewWorkspace";
import { useAuth } from "./context/AuthContext";

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            
            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-test"
              element={
                <ProtectedRoute>
                  <CreateTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/add-candidates"
              element={
                <ProtectedRoute>
                  <AddCandidates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/submissions"
              element={
                <ProtectedRoute>
                  <Submissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tests"
              element={
                <ProtectedRoute>
                  <TestManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Interview Workspace Routes */}
            <Route path="/interview" element={<InterviewWorkspace />} />
            <Route path="/interview/:assignmentId" element={<InterviewWorkspace />} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
