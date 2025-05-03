
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const AuthButton = () => {
  const { user, signOut, isLoading, userRole, checkUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // If user is logged in but role is not set, check role
    if (user && !userRole) {
      checkUserRole();
    }
  }, [user, userRole, checkUserRole]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    navigate("/");
  };

  const handleSignIn = () => {
    // Determine if we're in a candidate context based on URL
    const isCandidateContext = location.pathname.includes('candidate');
    navigate(isCandidateContext ? "/candidate-signin" : "/signin");
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="lg" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }

  if (!user) {
    return (
      <Button variant="ghost" size="lg" onClick={handleSignIn}>
        Login
      </Button>
    );
  }

  // Get user metadata or default values
  const userMetadata = user.user_metadata || {};
  const userName =
    userMetadata.full_name ||
    userMetadata.name ||
    user.email?.split("@")[0] ||
    "User";
  const userImage = userMetadata.avatar_url || userMetadata.image || null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            {userImage ? (
              <AvatarImage src={userImage} alt={userName} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {userRole && (
              <p className="text-xs text-muted-foreground capitalize">
                Role: {userRole}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate(userRole === "candidate" ? "/candidate-dashboard" : "/dashboard")}
        >
          {userRole === "candidate" ? "My Assignments" : "Dashboard"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={isSigningOut}
          onClick={handleSignOut}
        >
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing out
            </>
          ) : (
            "Sign out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
