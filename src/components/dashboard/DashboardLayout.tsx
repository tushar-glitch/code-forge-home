
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import TopNav from "./TopNav";
import { toast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Dashboard" 
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  // Define sidebar navigation items
  const navItems = [
    { 
      title: "Overview", 
      icon: LayoutDashboard, 
      path: "/dashboard",
      active: title === "Dashboard" 
    },
    { 
      title: "Create Test", 
      icon: PlusCircle, 
      path: "/dashboard/create-test",
      active: title === "Create Test" 
    },
    { 
      title: "Add Candidates", 
      icon: Users, 
      path: "/dashboard/add-candidates",
      active: title === "Add Candidates" 
    },
    { 
      title: "Submissions", 
      icon: FileText, 
      path: "/dashboard/submissions",
      active: title === "Submissions" 
    },
    { 
      title: "Test Management", 
      icon: FileText, 
      path: "/dashboard/tests",
      active: title === "Test Management" 
    },
    { 
      title: "Settings", 
      icon: SettingsIcon, 
      path: "/dashboard/settings",
      active: title === "Settings" 
    }
  ];
  
  return (
    <div className="flex h-screen flex-col">
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden w-full">
          <Sidebar side="left" variant="inset">
            <SidebarHeader className="flex flex-col gap-4 p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">CP</span>
                </div>
                <div className="text-xl font-bold">hire10xdevs</div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      isActive={item.active}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Avatar>
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset className="overflow-auto">
            <TopNav title={title} />
            <main className="p-4 md:p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
