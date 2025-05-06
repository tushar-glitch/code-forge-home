
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  LayersIcon,
  Trophy,
  Users,
  User,
  LogOut,
  Settings,
  Book
} from "lucide-react";

const CandidateNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/candidate/dashboard", label: "Dashboard", icon: Home },
    { path: "/candidate/challenges", label: "Challenges", icon: LayersIcon },
    { path: "/candidate/contests", label: "Contests", icon: Trophy },
    { path: "/candidate/leaderboard", label: "Leaderboard", icon: Users },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/90 backdrop-blur">
      <nav className="container flex max-w-7xl items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">CP</span>
          </div>
          <span className="text-xl font-bold hidden sm:block">hire10xdevs</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                asChild
                className={cn(
                  "gap-2",
                  isActive(item.path)
                    ? ""
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Link to={item.path}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                size="icon"
                variant={isActive(item.path) ? "default" : "ghost"}
                asChild
                className={cn(
                  isActive(item.path)
                    ? ""
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Link to={item.path}>
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.name || user.email || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.user_metadata?.name?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.user_metadata?.name || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/candidate/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/candidate-dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Book className="h-4 w-4" />
                    <span>My Assessments</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default CandidateNavbar;
