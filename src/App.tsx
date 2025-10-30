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

import TestDetails from "./pages/dashboard/TestDetails";
import GetStarted from "./pages/GetStarted";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import ChallengesPage from "./pages/candidate/ChallengesPage";
import ContestsPage from "./pages/candidate/ContestsPage";
import LeaderboardPage from "./pages/candidate/LeaderboardPage";
import ProfilePage from "./pages/candidate/ProfilePage";
import Profile from "./pages/dashboard/Profile";
import Billing from "./pages/dashboard/Billing";
import TestTakerWorkspace from "./pages/TestTakerWorkspace";
import ThankYou from "./pages/ThankYou";
import Welcome from "./pages/Welcome";
import EvaluationResult from "./pages/dashboard/EvaluationResult";
import TestOverviewPage from "./pages/dashboard/TestOverviewPage";
import PreviewChallenge from "./pages/PreviewChallenge";

import HomeLayout from "@/components/HomeLayout";

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
    return <Navigate to={userRole === "candidate" ? "/candidate/dashboard" : "/dashboard"} replace />;
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
            <Route path="/" element={<HomeLayout><Index /></HomeLayout>} />
            <Route path="/auth" element={<SignIn />} />
            <Route path="/signup" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/candidate-signin" element={<SignIn userType="candidate" />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/test/:accessLink" element={<TestTakerWorkspace />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/welcome/:accessLink" element={<Welcome />} />
            
            {/* Candidate Routes */}
            <Route 
              path="/interview/:assignmentId" 
              element={
                  <InterviewWorkspace />
              } 
            />

            {/* New Candidate Experience Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/challenges"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <ChallengesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/contests"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <ContestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/leaderboard"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <ProfilePage />
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
              path="/dashboard/invite-candidates"
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
              path="/dashboard/submissions/:submissionId/evaluation"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <EvaluationResult />
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
              path="/dashboard/tests/:testId/submissions"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <Submissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tests/:testId"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <TestDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/tests/:testId/overview"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <TestOverviewPage />
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
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/billing"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <Billing />
                </ProtectedRoute>
              }
            />
            


            <Route path="/preview/challenge/:id" element={<PreviewChallenge />} />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;