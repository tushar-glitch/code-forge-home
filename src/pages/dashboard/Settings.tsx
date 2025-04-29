
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, UploadCloud, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Dummy team members data
const teamMembers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    role: "admin"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
    role: "member"
  },
  {
    id: "user-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    avatar: "https://ui-avatars.com/api/?name=Robert+Johnson&background=random",
    role: "member"
  }
];

const Settings: React.FC = () => {
  const [companyData, setCompanyData] = useState({
    name: "Acme Inc.",
    website: "https://acme.example.com",
    description: "A leading tech company specializing in developer hiring solutions.",
    address: "123 Tech Street, Silicon Valley, CA 94025",
    phone: "+1 (555) 123-4567"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    candidateSubmissions: true,
    teamActivity: true,
    marketingUpdates: false
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleCompanyDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been updated"
      });
    }, 1500);
    
    // Reset file input
    e.target.value = "";
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully"
      });
    }, 1000);
  };
  
  return (
    <DashboardLayout title="Settings">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Company Logo */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Company Logo</CardTitle>
                  <CardDescription>
                    Upload your company logo to personalize your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20 rounded-md">
                      <AvatarImage src="https://ui-avatars.com/api/?name=Acme+Inc&size=80&background=7E69AB&color=fff" alt="Acme Inc." />
                      <AvatarFallback className="rounded-md">AI</AvatarFallback>
                    </Avatar>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Recommended size: 256x256px</p>
                        <p>Formats: PNG, JPG, SVG</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <Input
                            id="logo"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("logo")?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Upload Logo
                              </>
                            )}
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" disabled={isUploading}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Information */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Update your company details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="name"
                        value={companyData.name}
                        onChange={handleCompanyDataChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={companyData.website}
                        onChange={handleCompanyDataChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={companyData.description}
                      onChange={handleCompanyDataChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={companyData.address}
                        onChange={handleCompanyDataChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={companyData.phone}
                        onChange={handleCompanyDataChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationChange("emailNotifications")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Candidate Submissions</h3>
                        <p className="text-sm text-muted-foreground">
                          When candidates complete a test
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.candidateSubmissions}
                        onCheckedChange={() => handleNotificationChange("candidateSubmissions")}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Team Activity</h3>
                        <p className="text-sm text-muted-foreground">
                          When team members make changes
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.teamActivity}
                        onCheckedChange={() => handleNotificationChange("teamActivity")}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Marketing Updates</h3>
                        <p className="text-sm text-muted-foreground">
                          Latest news and feature announcements
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingUpdates}
                        onCheckedChange={() => handleNotificationChange("marketingUpdates")}
                        disabled={!notificationSettings.emailNotifications}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="team">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage your team members and permissions
                    </CardDescription>
                  </div>
                  <Button>Invite Member</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center justify-between rounded-md border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge 
                            className={
                              member.role === "admin" 
                                ? "bg-primary/20 text-primary hover:bg-primary/30" 
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {member.role === "admin" ? "Admin" : "Member"}
                          </Badge>
                          {member.role !== "admin" && (
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
};

// Missing import at the beginning
function Separator() {
  return <div className="h-px bg-border" />;
}

function MoreHorizontal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export default Settings;
