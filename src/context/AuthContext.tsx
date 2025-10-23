import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

// Define user roles
export type UserRole = "recruiter" | "candidate";

// Custom User and Session types for our backend
interface AuthUser {
  id: string;
  email: string;
  role?: UserRole;
}

interface AuthSession {
  token: string;
  userId: string;
}

type AuthContextType = {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  userRole: UserRole | null;
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
  return path.startsWith("/candidate/dashboard") || path.startsWith("/interview");
};

// Helper to determine where to redirect users based on their role
const getRedirectPath = (role: UserRole | null): string => {
  if (role === "recruiter") return "/dashboard";
  if (role === "candidate") return "/candidate/dashboard";
  return "/";
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserRole = async (): Promise<UserRole | null> => {
    if (!user) return null;
    try {
      // Call backend to get user role
      const response = await api.get<{ role: UserRole }>(`/users/${user.id}/role`, session?.token);
      setUserRole(response.role);
      // Update user object with role
      setUser(prevUser => prevUser ? { ...prevUser, role: response.role } : null);
      localStorage.setItem('userRole', response.role);
      return response.role;
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole(null);
      localStorage.removeItem('userRole');
      return null;
    }
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
        navigate("/candidate/dashboard");
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

  // Initial load: check for existing token in localStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      const storedEmail = localStorage.getItem('email');
      const storedRole = localStorage.getItem('userRole') as UserRole | null;

      if (storedToken && storedUserId && storedEmail) {
        setSession({ token: storedToken, userId: storedUserId });
        setUser({ id: storedUserId, email: storedEmail, role: storedRole || undefined });
        if (storedRole) {
          setUserRole(storedRole);
        } else {
          // If role not in localStorage, fetch it
          await checkUserRole();
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await api.login<{ token: string; userId: string; role: UserRole }>({
        email,
        password,
      });

      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('email', email); // Store email for user object
      localStorage.setItem('userRole', result.role); // Store role

      setSession({ token: result.token, userId: result.userId });
      setUser({ id: result.userId, email, role: result.role });
      setUserRole(result.role);
      
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
      const result = await api.register<{ token: string; userId: string; role: UserRole }>({
        email,
        password,
        role, // Pass role to backend for user creation and candidate/recruiter linking
        firstName,
        lastName,
      });

      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('email', email);
      localStorage.setItem('userRole', result.role); // Store role

      setSession({ token: result.token, userId: result.userId });
      setUser({ id: result.userId, email, role: result.role });
      setUserRole(result.role); // Set role immediately after signup

      return result;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('userRole'); // Remove role
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