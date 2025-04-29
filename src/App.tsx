
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create-test" element={<CreateTest />} />
            <Route path="/dashboard/add-candidates" element={<AddCandidates />} />
            <Route path="/dashboard/submissions" element={<Submissions />} />
            <Route path="/dashboard/tests" element={<TestManagement />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/interview" element={<InterviewWorkspace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
