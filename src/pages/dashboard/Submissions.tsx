
import React, { useState } from "react";
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
  XCircle 
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

// Dummy data for submissions
const submissionsData = [
  {
    id: "sub-1",
    candidate: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=random"
    },
    test: "React Frontend Bug Fix",
    timeTaken: 42,
    submittedAt: "2025-04-27T14:30:00",
    status: "passed"
  },
  {
    id: "sub-2",
    candidate: {
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      avatar: "https://ui-avatars.com/api/?name=Emma+Johnson&background=random"
    },
    test: "Node.js API Implementation",
    timeTaken: 55,
    submittedAt: "2025-04-26T10:15:00",
    status: "failed"
  },
  {
    id: "sub-3",
    candidate: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=random"
    },
    test: "Full Stack App Debug",
    timeTaken: 38,
    submittedAt: "2025-04-25T16:45:00",
    status: "pending"
  },
  {
    id: "sub-4",
    candidate: {
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Davis&background=random"
    },
    test: "Algorithm Challenge",
    timeTaken: 47,
    submittedAt: "2025-04-24T09:20:00",
    status: "passed"
  },
  {
    id: "sub-5",
    candidate: {
      name: "David Wilson",
      email: "david.wilson@example.com",
      avatar: "https://ui-avatars.com/api/?name=David+Wilson&background=random"
    },
    test: "Node.js API Implementation",
    timeTaken: 61,
    submittedAt: "2025-04-23T13:40:00",
    status: "failed"
  }
];

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

// Sample code for the dialog
const sampleCode = `import React, { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This should fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;`;

const Submissions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleRowClick = (submissionId: string) => {
    setSelectedSubmission(submissionId);
    setIsDialogOpen(true);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredSubmissions = submissionsData.filter(
    (submission) =>
      submission.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.test.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">All Submissions</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Passed Only</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Failed Only</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Pending Review</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Test Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">React Tests</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Node.js Tests</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Full Stack Tests</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <SortAsc className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Newest First</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Oldest First</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Time Taken (Low to High)</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Time Taken (High to Low)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="icon" variant="outline">
              <Calendar className="h-4 w-4" />
            </Button>
            
            <Button size="icon" variant="outline">
              <Download className="h-4 w-4" />
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
              {filteredSubmissions.map((submission) => (
                <TableRow 
                  key={submission.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(submission.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={submission.candidate.avatar} alt={submission.candidate.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {submission.candidate.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{submission.candidate.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {submission.candidate.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{submission.test}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {submission.timeTaken} min
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(submission.submittedAt)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${statusColor(submission.status)} flex w-fit items-center gap-1 capitalize`}
                    >
                      {statusIcon(submission.status)}
                      {submission.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSubmissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">No submissions match your search</p>
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
            <div className="rounded-md bg-muted/50 p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={submissionsData.find(s => s.id === selectedSubmission)?.candidate.avatar} 
                    alt={submissionsData.find(s => s.id === selectedSubmission)?.candidate.name} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {submissionsData.find(s => s.id === selectedSubmission)?.candidate.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{submissionsData.find(s => s.id === selectedSubmission)?.candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{submissionsData.find(s => s.id === selectedSubmission)?.candidate.email}</p>
                </div>
                <div className="ml-auto">
                  <Badge 
                    className={`${statusColor(submissionsData.find(s => s.id === selectedSubmission)?.status || "")} flex w-fit items-center gap-1 capitalize`}
                  >
                    {statusIcon(submissionsData.find(s => s.id === selectedSubmission)?.status || "")}
                    {submissionsData.find(s => s.id === selectedSubmission)?.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Test Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Test Name</p>
                <p className="text-sm font-medium">{submissionsData.find(s => s.id === selectedSubmission)?.test}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Time Taken</p>
                <p className="text-sm font-medium">{submissionsData.find(s => s.id === selectedSubmission)?.timeTaken} minutes</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Submitted On</p>
                <p className="text-sm font-medium">{formatDate(submissionsData.find(s => s.id === selectedSubmission)?.submittedAt || "")}</p>
              </div>
            </div>

            {/* Code Submission */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Code Submission</p>
              <div className="max-h-72 overflow-auto rounded-md bg-slate-950 p-4">
                <pre className="text-xs text-slate-50">
                  <code>{sampleCode}</code>
                </pre>
              </div>
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
                  <DropdownMenuItem className="cursor-pointer">Mark as Passed</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Mark as Failed</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Mark as Pending</DropdownMenuItem>
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
