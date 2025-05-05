
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  CheckCircle2, 
  Clock, 
  Download, 
  Filter, 
  Search, 
  SortAsc, 
  XCircle,
  Loader2 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
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

// Interface for a submission
interface Submission {
  id: number;
  assignment_id: number;
  content: string;
  saved_at: string;
  created_at: string;
  test_assignment?: {
    id: number;
    candidate?: {
      id: number;
      email: string;
      first_name?: string;
      last_name?: string;
    };
    test?: {
      id: number;
      test_title: string;
      user_id: string;
    };
    started_at?: string;
    completed_at?: string;
    status: string;
  };
}

const Submissions: React.FC = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submissionContent, setSubmissionContent] = useState<string>("");
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch submissions data
  const {
    data: submissions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          test_assignment:assignment_id (
            id, 
            status,
            started_at,
            completed_at,
            candidate:candidate_id (
              id, 
              email, 
              first_name, 
              last_name
            ),
            test:test_id (
              id, 
              test_title,
              user_id
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Filter submissions to only include those from tests created by this user
      return data.filter((submission: Submission) => 
        submission.test_assignment?.test?.user_id === user.id
      );
    },
    enabled: !!user
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load submissions data",
        variant: "destructive"
      });
      console.error("Submissions query error:", error);
    }
  }, [error, toast]);

  const handleViewSubmission = async (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
    setIsLoadingSubmission(true);
    
    try {
      // Load the submission content
      if (submission.content) {
        setSubmissionContent(submission.content);
      } else {
        setSubmissionContent("No content available for this submission.");
      }
    } catch (error) {
      console.error("Error parsing submission content:", error);
      setSubmissionContent("Error loading submission content.");
    } finally {
      setIsLoadingSubmission(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTimeTaken = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return "N/A";
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffMinutes = Math.round((end - start) / (1000 * 60));
    
    return `${diffMinutes} min`;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "pending":
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      case "pending":
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCandidateName = (submission: Submission) => {
    const candidate = submission.test_assignment?.candidate;
    if (candidate?.first_name || candidate?.last_name) {
      return `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim();
    }
    return candidate?.email?.split('@')[0] || 'Unknown';
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Apply filters and sorting to submissions
  const processedSubmissions = React.useMemo(() => {
    if (!submissions) return [];

    let filtered = [...submissions];
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(submission => 
        submission.test_assignment?.status === statusFilter
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(submission => {
        const candidateName = getCandidateName(submission).toLowerCase();
        const candidateEmail = submission.test_assignment?.candidate?.email?.toLowerCase() || '';
        const testTitle = submission.test_assignment?.test?.test_title?.toLowerCase() || '';
        
        return candidateName.includes(term) ||
               candidateEmail.includes(term) || 
               testTitle.includes(term);
      });
    }
    
    // Apply sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [submissions, searchTerm, statusFilter, sortOrder]);

  const handleSortChange = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
  };

  const handleStatusChange = (status: string | null) => {
    setStatusFilter(status);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedSubmission) return;
    
    try {
      const { error } = await supabase
        .from('test_assignments')
        .update({ status })
        .eq('id', selectedSubmission.test_assignment?.id);
      
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Submission status has been set to ${status}`
      });
      
      // Refresh submissions data
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive"
      });
    }
  };

  const parseAndDisplayCode = (content: string) => {
    try {
      // Try to parse as JSON first (for multi-file content)
      const parsed = JSON.parse(content);
      
      // If it's a multi-file object, display the first file's content
      if (typeof parsed === 'object') {
        const firstFilePath = Object.keys(parsed)[0];
        return parsed[firstFilePath] || "No code content found";
      }
      
      // If it's a string, just return that
      return content;
    } catch (e) {
      // If JSON parsing fails, just return the content as is
      return content;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Submissions">
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading submissions...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Submissions">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Search and Filters */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  {statusFilter ? `Filter: ${statusFilter}` : "Filter"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusChange(null)}>
                  All Submissions
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusChange('completed')}>
                  Completed Only
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusChange('failed')}>
                  Failed Only
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusChange('in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusChange('pending')}>
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <SortAsc className="h-4 w-4" />
                  {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleSortChange('newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleSortChange('oldest')}>
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="icon" variant="outline" onClick={() => refetch()}>
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Submissions Table */}
        <motion.div variants={itemVariants} className="rounded-md border shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Test</TableHead>
                <TableHead className="hidden md:table-cell">Time Taken</TableHead>
                <TableHead className="hidden md:table-cell">Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedSubmissions.length > 0 ? (
                processedSubmissions.map((submission) => (
                  <TableRow 
                    key={submission.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getCandidateName(submission))}&background=random`} 
                            alt={getCandidateName(submission)} 
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(getCandidateName(submission))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getCandidateName(submission)}</div>
                          <div className="text-xs text-muted-foreground">
                            {submission.test_assignment?.candidate?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{submission.test_assignment?.test?.test_title || "Unknown Test"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {calculateTimeTaken(
                        submission.test_assignment?.started_at,
                        submission.test_assignment?.completed_at
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(submission.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${statusColor(submission.test_assignment?.status || "")} flex w-fit items-center gap-1 capitalize`}
                      >
                        {statusIcon(submission.test_assignment?.status || "")}
                        {submission.test_assignment?.status || "Unknown"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No submissions match your search</p>
                    {!statusFilter && searchTerm === '' && (
                      <p className="text-sm mt-2">
                        Submissions will appear here when candidates complete tests
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>

      {/* Submission Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review candidate submission and provide feedback.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Candidate Info */}
            {selectedSubmission && (
              <div className="rounded-md bg-muted/50 p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getCandidateName(selectedSubmission))}&background=random`}
                      alt={getCandidateName(selectedSubmission)}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(getCandidateName(selectedSubmission))}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{getCandidateName(selectedSubmission)}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.test_assignment?.candidate?.email}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge 
                      className={`${statusColor(selectedSubmission.test_assignment?.status || "")} flex w-fit items-center gap-1 capitalize`}
                    >
                      {statusIcon(selectedSubmission.test_assignment?.status || "")}
                      {selectedSubmission.test_assignment?.status || "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Test Info */}
            {selectedSubmission && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Test Name</p>
                  <p className="text-sm font-medium">{selectedSubmission.test_assignment?.test?.test_title || "Unknown Test"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Time Taken</p>
                  <p className="text-sm font-medium">
                    {calculateTimeTaken(
                      selectedSubmission.test_assignment?.started_at,
                      selectedSubmission.test_assignment?.completed_at
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Submitted On</p>
                  <p className="text-sm font-medium">{formatDate(selectedSubmission.created_at)}</p>
                </div>
              </div>
            )}

            {/* Code Submission */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Code Submission</p>
              {isLoadingSubmission ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <p>Loading submission content...</p>
                </div>
              ) : (
                <div className="max-h-72 overflow-auto rounded-md bg-slate-950 p-4">
                  <pre className="text-xs text-slate-50">
                    <code>{parseAndDisplayCode(submissionContent)}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Feedback & Notes
              </label>
              <textarea
                id="feedback"
                rows={3}
                className="w-full rounded-md border p-2 text-sm"
                placeholder="Add your feedback for the candidate..."
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline">Download Code</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus("completed")}>
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus("failed")}>
                    Mark as Failed
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateStatus("pending")}>
                    Mark as Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button>Save Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Submissions;