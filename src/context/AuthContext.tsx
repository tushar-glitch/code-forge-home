
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Define user roles
export type UserRole = "recruiter" | "candidate";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: UserRole | null;
  signIn: (provider: "google" | "github" | string, options?: any) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, role?: UserRole, firstName?: string, lastName?: string) => Promise<any>;
  signOut: () => Promise<void>;
  checkUserRole: () => Promise<UserRole | null>;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if path is meant for recruiters
const isRecruiterPath = (path: string): boolean => {
  return path.startsWith("/dashboard");
};

// Helper function to check if path is meant for candidates
const isCandidatePath = (path: string): boolean => {
  return path.startsWith("/candidate-dashboard") || path.startsWith("/interview");
};

// Helper to determine where to redirect users based on their role
const getRedirectPath = (role: UserRole | null): string => {
  if (role === "recruiter") return "/dashboard";
  if (role === "candidate") return "/candidate-dashboard";
  return "/";
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserRole = async (): Promise<UserRole | null> => {
    if (!user) return null;
    
    // Check if user is in candidates table
    const { data: candidateData } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', user.email)
      .maybeSingle();
    
    if (candidateData) {
      setUserRole("candidate");
      return "candidate";
    }
    
    // If not a candidate, they're a recruiter
    setUserRole("recruiter");
    return "recruiter";
  };

  // Check if user is authorized for current path
  const isAuthorized = (allowedRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  };

  // Enforce route-based access control
  useEffect(() => {
    const enforceRouteAccess = async () => {
      if (isLoading || !user) return;
      
      if (!userRole) {
        const role = await checkUserRole();
        
        // If we still couldn't determine role, log them out
        if (!role) {
          toast({
            title: "Authentication error",
            description: "Unable to determine user role. Please sign in again.",
            variant: "destructive"
          });
          await signOut();
          return;
        }
      }

      // Enforce access rules
      if (isRecruiterPath(location.pathname) && userRole === "candidate") {
        toast({
          title: "Access Denied",
          description: "Candidates cannot access recruiter pages",
          variant: "destructive"
        });
        navigate("/candidate-dashboard");
      } else if (isCandidatePath(location.pathname) && userRole === "recruiter") {
        toast({
          title: "Access Denied",
          description: "Recruiters cannot access candidate pages",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    };

    if (user) {
      enforceRouteAccess();
    }
  }, [location.pathname, user, userRole, isLoading]);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Reset role when auth state changes
        if (!session?.user) {
          setUserRole(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Check role if user is logged in
      if (session?.user) {
        checkUserRole();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (provider: "google" | "github" | string, options?: any) => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: options || { redirectTo: window.location.origin },
      });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      // Check role after signing in
      if (result.data.user) {
        await checkUserRole();
      }
      
      return result;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    role: UserRole = "recruiter", 
    firstName?: string, 
    lastName?: string
  ) => {
    try {
      const result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${role === "recruiter" ? "/dashboard" : "/candidate-dashboard"}`,
        }
      });

      // If it's a candidate, create an entry in the candidates table
      if (role === "candidate" && result.data.user) {
        await supabase
          .from('candidates')
          .insert({
            email,
            first_name: firstName || null,
            last_name: lastName || null
          });
      }
      
      return result;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Explicitly update state after sign out
      setUser(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        isLoading, 
        userRole, 
        signIn, 
        signInWithEmail, 
        signUp, 
        signOut,
        checkUserRole,
        isAuthorized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
