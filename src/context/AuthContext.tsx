
import React, { createContext, useContext, useState, useEffect } from "react";

// Define authentication types
type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (provider: "google") => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // Simple sign-in function (mock for now)
  const signIn = async (provider: "google") => {
    setIsLoading(true);
    
    // In a real implementation, we would use Firebase/Auth0/etc
    // For this demo, we'll simulate a successful Google sign-in
    if (provider === "google") {
      const mockUser: User = {
        id: "google-user-123",
        name: "Demo User",
        email: "user@example.com",
        image: "https://ui-avatars.com/api/?name=Demo+User&background=random"
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    }
    
    setIsLoading(false);
  };

  // Sign out function
  const signOut = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
