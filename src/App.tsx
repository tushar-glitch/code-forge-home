
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, UserRole, useAuth } from "@/context/AuthContext";
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
import GetStarted from "./pages/GetStarted";
import CandidateDashboard from "./pages/CandidateDashboard";

// Role-based protected route component
interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading, userRole, isAuthorized } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  if (!isAuthorized(allowedRoles)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={userRole === "candidate" ? "/candidate-dashboard" : "/dashboard"} replace />;
  }
  
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/candidate-signin" element={<SignIn userType="candidate" />} />
            <Route path="/get-started" element={<GetStarted />} />
            
            {/* Candidate Routes */}
            <Route
              path="/candidate-dashboard"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/interview/:assignmentId" 
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <InterviewWorkspace />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Dashboard Routes - Recruiter Only */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-test"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <CreateTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/add-candidates"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <AddCandidates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/submissions"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <Submissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tests"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <TestManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
