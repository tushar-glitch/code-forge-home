import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Loader2,
  Mail,
  UploadCloud,
  X,
  Link,
  Send,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Test, addCandidate, fetchTests, generateTestAssignment, sendTestInvitation } from "@/lib/test-management-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const AddCandidates: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [tests, setTests] = useState<Test[]>([]);
  const [candidates, setCandidates] = useState<CandidateWithLink[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const loadTests = async () => {
      setIsLoading(true);
      const testsData = await fetchTests();
      setTests(testsData);
      setIsLoading(false);
    };

    loadTests();
  }, [user, navigate]);

  const handleAddCandidate = (values: z.infer<typeof formSchema>) => {
    if (candidates.find((c) => c.email === values.email)) {
      toast({
        title: "Duplicate email",
        description: "This email is already in the list",
        variant: "destructive",
      });
      return;
    }

    const newCandidate: CandidateWithLink = {
      email: values.email,
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      status: "pending",
    };

    setCandidates([...candidates, newCandidate]);
    form.reset();
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

    // Read and parse CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        const emailIndex = headers.indexOf("email");
        const firstNameIndex =
          headers.indexOf("firstname") !== -1
            ? headers.indexOf("firstname")
            : headers.indexOf("first_name") !== -1
            ? headers.indexOf("first_name")
            : headers.indexOf("first name");

        const lastNameIndex =
          headers.indexOf("lastname") !== -1
            ? headers.indexOf("lastname")
            : headers.indexOf("last_name") !== -1
            ? headers.indexOf("last_name")
            : headers.indexOf("last name");

        if (emailIndex === -1) {
          throw new Error("CSV file must contain an 'email' column");
        }

        const newCandidates = [...candidates];
        let addedCount = 0;

        // Start from line 1 (skip headers)
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines

          const values = lines[i].split(",").map((v) => v.trim());
          const candidateEmail = values[emailIndex];

          // Skip if email is invalid or already in the list
          if (
            !candidateEmail ||
            !candidateEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
            candidates.find((c) => c.email === candidateEmail)
          ) {
            continue;
          }

          const candidate: CandidateWithLink = {
            email: candidateEmail,
            status: "pending",
          };

          if (firstNameIndex !== -1 && values[firstNameIndex]) {
            candidate.firstName = values[firstNameIndex];
          }

          if (lastNameIndex !== -1 && values[lastNameIndex]) {
            candidate.lastName = values[lastNameIndex];
          }

          newCandidates.push(candidate);
          addedCount++;
        }

        setCandidates(newCandidates);

        toast({
          title: "CSV processed",
          description: `Added ${addedCount} candidates from CSV`,
        });
      } catch (error: unknown) {
        let errorMessage = "Could not parse the CSV file";

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: "Error processing CSV",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);

    // Reset file input
    e.target.value = "";
  };

  const handleGenerateLinks = async () => {
    if (candidates.length === 0) {
      toast({
        title: "No candidates",
        description: "Please add at least one candidate",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTest) {
      toast({
        title: "No test selected",
        description: "Please select a test first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Generate links for each candidate
    const updatedCandidates = [...candidates];
    const selectedTestData = tests.find((t) => t.id === selectedTest);

    if (!selectedTestData) {
      toast({
        title: "Test not found",
        description: "The selected test could not be found",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    for (let i = 0; i < updatedCandidates.length; i++) {
      if (!updatedCandidates[i].testLink) {
        try {
          // Add candidate to the database
          const candidateId = await addCandidate({
            email: updatedCandidates[i].email,
            first_name: updatedCandidates[i].firstName,
            last_name: updatedCandidates[i].lastName,
          }, user.id); // Pass user.id as invitedById

          if (candidateId) {
            // Generate test assignment and get access link
            const accessLink = await generateTestAssignment(
              selectedTest,
              candidateId
            );

            if (accessLink) {
              updatedCandidates[
                i
              ].testLink = `${window.location.origin}/test/${accessLink}`;
              updatedCandidates[i].status = "ready";
            }
          }
        } catch (error) {
          console.error("Error generating link for candidate:", error);
        }
      }
    }

    setCandidates(updatedCandidates);
    setIsGenerating(false);

    toast({
      title: "Links generated",
      description: `Generated links for ${
        updatedCandidates.filter((c) => c.testLink).length
      } candidates`,
    });
  };

  const handleSendInvitations = async () => {
    if (candidates.length === 0) {
      toast({
        title: "No candidates",
        description: "Please add at least one candidate",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTest) {
      toast({
        title: "No test selected",
        description: "Please select a test first",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setProgress(0);

    const selectedTestData = tests.find((t) => t.id === selectedTest);
    if (!selectedTestData || !selectedTestData.test_title) {
      toast({
        title: "Test not found",
        description: "The selected test information is incomplete",
        variant: "destructive",
      });
      setIsSending(false);
      return;
    }

    const updatedCandidates = [...candidates];
    let sentCount = 0;

    for (let i = 0; i < updatedCandidates.length; i++) {
      const candidate = updatedCandidates[i];

      try {
        if (!candidate.testLink) {
          updatedCandidates[i].status = "generating";
          setCandidates([...updatedCandidates]);

          const candidateId = await addCandidate({
            email: candidate.email,
            first_name: candidate.firstName,
            last_name: candidate.lastName,
          }, user.id); // Pass user.id as invitedById

          if (candidateId) {
            const accessLink = await generateTestAssignment(
              selectedTest,
              candidateId
            );

            if (accessLink) {
              candidate.testLink = `${window.location.origin}/test/${accessLink}`;
              candidate.status = "ready";
              setCandidates([...updatedCandidates]);
            }
          }
        }

        if (candidate.testLink && candidate.status !== "sent") {
          updatedCandidates[i].status = "sending";
          setCandidates([...updatedCandidates]);

          const success = await sendTestInvitation(
            candidate.email,
            selectedTestData.test_title,
            candidate.testLink,
            candidate.firstName
          );

          if (success) {
            updatedCandidates[i].status = "sent";
            sentCount++;
            setCandidates([...updatedCandidates]);
          }
        }
      } catch (error) {
        console.error("Error processing candidate:", error);
        updatedCandidates[i].status = "failed";
        setCandidates([...updatedCandidates]);
      }
      setProgress(((i + 1) / updatedCandidates.length) * 100);
    }

    setIsSending(false);

    toast({
      title: "Invitations sent",
      description: `Sent ${sentCount} test invitations`,
    });
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500/10 text-green-600";
      case "ready":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-yellow-500/10 text-yellow-600";
    }
  };

  return (
    <DashboardLayout title="Invite Candidates">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Test Selection Section */}
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Select Test</CardTitle>
              <CardDescription>
                Choose which test to send to candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading tests...</span>
                </div>
              ) : tests.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    No tests available. Please create a test first.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => navigate("/dashboard/create-test")}
                  >
                    Create Test
                  </Button>
                </div>
              ) : (
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a test" />
                  </SelectTrigger>
                  <SelectContent>
                    {tests.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.test_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        </motion.section>

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
              {/* Manual Entry */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddCandidate)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <Label>First Name (Optional)</Label>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Last Name (Optional)</Label>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Email Address*</Label>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Clear
                    </Button>
                    <Button type="submit">Add Candidate</Button>
                  </div>
                </form>
              </Form>

              {isSending && (
                <div className="space-y-2">
                  <Label>Sending invitations...</Label>
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                </div>
              )}

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
                        <div className="flex items-center flex-1 overflow-hidden mr-2">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                          <div className="truncate">
                            <span className="text-sm">
                              {candidate.firstName || candidate.lastName
                                ? `${candidate.firstName || ""} ${
                                    candidate.lastName || ""
                                  } `
                                : ""}
                              &lt;{candidate.email}&gt;
                            </span>
                            {candidate.testLink && (
                              <div className="text-xs text-muted-foreground truncate">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] mr-2 ${getStatusBadgeClass(
                                    candidate.status
                                  )}`}
                                >
                                  {candidate.status}
                                </span>
                                {candidate.testLink}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {candidate.testLink && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  candidate.testLink || ""
                                );
                                toast({ title: "Link copied to clipboard" });
                              }}
                            >
                              <Link className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCandidate(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <Button
                      variant="outline"
                      disabled={candidates.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export List
                    </Button>
                    <div className="flex gap-2">

                      <Button
                        onClick={handleSendInvitations}
                        disabled={isSending || candidates.length === 0}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Invitations
                          </>
                        )}
                      </Button>
                    </div>
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
