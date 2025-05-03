
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SignInProps {
  userType?: "recruiter" | "candidate";
  onSuccess?: () => void;
}

const SignIn = ({ userType = "recruiter", onSuccess }: SignInProps) => {
  const { user, signInWithEmail, signUp, signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    // Redirect if user is already authenticated (for standard page loads, not modal)
    if (user && !isLoading && !onSuccess) {
      if (userType === "recruiter") {
        navigate("/dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    }
  }, [user, isLoading, navigate, onSuccess, userType]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Authentication error",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      
      // Check if this is a candidate or recruiter
      if (userType === "candidate") {
        // Check if email exists in candidates table
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        
        if (candidateError) throw candidateError;
        
        if (!candidate) {
          throw new Error("No candidate account found with this email");
        }
      }
      
      toast({
        title: "Success!",
        description: "You have successfully signed in.",
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(userType === "recruiter" ? "/dashboard" : "/candidate-dashboard");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Authentication error",
        description: error.message || "Could not sign in with email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // First check if the candidate already exists in the candidates table
      if (userType === "candidate") {
        const { data: existingCandidate } = await supabase
          .from('candidates')
          .select('*')
          .eq('email', email)
          .maybeSingle();
          
        if (existingCandidate) {
          throw new Error("A candidate with this email already exists. Please sign in instead.");
        }
      }
    
      // Create the user account
      const { error, data } = await signUp(email, password);
      if (error) throw error;
      
      if (userType === "candidate" && data?.user) {
        // Create a candidate record
        const { error: candidateError } = await supabase
          .from('candidates')
          .insert({
            email,
            first_name: firstName,
            last_name: lastName
          });
          
        if (candidateError) throw candidateError;
      }
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "Registration error",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !onSuccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`${!onSuccess ? "container flex min-h-[80vh] flex-col items-center justify-center max-w-md mx-auto py-20" : ""}`}>
      <Card className={`${onSuccess ? "" : "w-full"}`}>
        {!onSuccess && (
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to hire10xdevs</CardTitle>
            <CardDescription>
              {userType === "recruiter" 
                ? "Sign in to access your account and start assessing candidates." 
                : "Sign in to view and take your assigned tests."}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className="flex flex-col gap-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In with Email"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                {userType === "candidate" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input 
                          id="first-name" 
                          type="text" 
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input 
                          id="last-name" 
                          type="text" 
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
