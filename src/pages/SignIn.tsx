import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface SignInProps {
  userType?: "recruiter" | "candidate";
  onSuccess?: () => void;
}

const SignIn = ({ userType = "recruiter", onSuccess }: SignInProps) => {
  const { user, signInWithEmail, isLoading, userRole } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Redirect if user is already authenticated (for standard page loads, not modal)
    if (user && !isLoading && !onSuccess) {
      // Check if user role matches intended route
      if (userType === "recruiter" && userRole === "recruiter") {
        navigate("/dashboard");
      } else if (userType === "candidate" && userRole === "candidate") {
        navigate("/candidate/dashboard");
      } else if (userRole) {
        // If user is trying to access wrong area, redirect to their appropriate dashboard
        navigate(
          userRole === "candidate" ? "/candidate/dashboard" : "/dashboard"
        );
      }
    }
  }, [user, isLoading, navigate, onSuccess, userType, userRole]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      
      toast({
        title: "Success!",
        description: "You have successfully signed in.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Error signing in:", error);
      let errorMessage = "Something went wrong";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Authentication error",
        description:
          errorMessage || "Could not sign in with email. Please try again.",
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
    <div
      className={`${
        !onSuccess
          ? "container flex min-h-[80vh] flex-col items-center justify-center max-w-md mx-auto py-20"
          : ""
      }`}
    >
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Removed Google Sign-in button */}
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