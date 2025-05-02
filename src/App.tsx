
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import GetStarted from "./pages/GetStarted";
import Dashboard from "./pages/dashboard/Dashboard";
import TestManagement from "./pages/dashboard/TestManagement";
import CreateTest from "./pages/dashboard/CreateTest";
import AddCandidates from "./pages/dashboard/AddCandidates"; 
import Settings from "./pages/dashboard/Settings";
import Submissions from "./pages/dashboard/Submissions";
import InterviewWorkspace from "./pages/InterviewWorkspace";
import { AuthProvider } from "./context/AuthContext";
import CandidateDashboard from "./pages/CandidateDashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/tests" element={<TestManagement />} />
            <Route path="/dashboard/create-test" element={<CreateTest />} />
            <Route path="/dashboard/add-candidates/:testId" element={<AddCandidates />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/submissions" element={<Submissions />} />
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="/interview/:assignmentId" element={<InterviewWorkspace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
