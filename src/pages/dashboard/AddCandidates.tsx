
import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, Mail, UploadCloud, X } from "lucide-react";
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

const AddCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddCandidate = () => {
    if (!email) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (candidates.includes(email)) {
      toast({
        title: "Duplicate email",
        description: "This email is already in the list",
        variant: "destructive"
      });
      return;
    }

    setCandidates([...candidates, email]);
    setEmail("");
  };

  const handleRemoveCandidate = (index: number) => {
    const newCandidates = [...candidates];
    newCandidates.splice(index, 1);
    setCandidates(newCandidates);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Simulate file upload and processing
    setTimeout(() => {
      // In a real app, you'd parse the CSV here
      const mockEmails = [
        "john.doe@example.com",
        "jane.smith@example.com",
        "robert.johnson@example.com",
        "emily.williams@example.com",
        "michael.brown@example.com"
      ];
      
      const newCandidates = [...candidates];
      mockEmails.forEach(email => {
        if (!newCandidates.includes(email)) {
          newCandidates.push(email);
        }
      });
      
      setCandidates(newCandidates);
      setIsUploading(false);
      
      toast({
        title: "CSV processed",
        description: `Added ${mockEmails.length} candidates from CSV`,
      });
    }, 1500);
    
    // Reset file input
    e.target.value = "";
  };

  const handleGenerateLinks = () => {
    if (candidates.length === 0) {
      toast({
        title: "No candidates",
        description: "Please add at least one candidate",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate link generation
    setTimeout(() => {
      setIsGenerating(false);
      
      toast({
        title: "Links generated",
        description: `Generated links for ${candidates.length} candidates`,
      });
    }, 1500);
  };

  return (
    <DashboardLayout title="Add Candidates">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Add Candidates Section */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Add Candidates</CardTitle>
              <CardDescription>
                Add candidates to send test invitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Manual Email Entry */}
              <div className="space-y-4">
                <Label htmlFor="email">Candidate Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCandidate();
                      }
                    }}
                  />
                  <Button onClick={handleAddCandidate}>Add</Button>
                </div>
              </div>

              {/* CSV Upload */}
              <div className="space-y-4">
                <Label>Or Upload a CSV</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a CSV file or click to browse
                  </p>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("csvFile")?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Select CSV"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    CSV must include email column
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Candidates List Section */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Candidates List</CardTitle>
              <CardDescription>
                {candidates.length} candidates added
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidates.length > 0 ? (
                <>
                  <div className="max-h-60 overflow-auto space-y-2">
                    {candidates.map((candidate, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{candidate}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCandidate(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" disabled={candidates.length === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export List
                    </Button>
                    <Button onClick={handleGenerateLinks} disabled={isGenerating || candidates.length === 0}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Test Links"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No candidates added yet. Add candidates above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </DashboardLayout>
  );
};

export default AddCandidates;
