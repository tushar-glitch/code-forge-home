
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  Copy, 
  Filter, 
  MoreHorizontal, 
  Pencil, 
  Search, 
  SortAsc, 
  Trash2, 
  Users,
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchTests, deleteTest, duplicateTest, Test } from "@/lib/test-management-utils";

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

const TestManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = (testId: string) => {
    setTestToDelete(testId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!testToDelete) return;
    
    const success = await deleteTest(testToDelete);
    if (success) {
      setTests(tests.filter(test => test.id !== testToDelete));
    }
    
    setIsDeleteDialogOpen(false);
    setTestToDelete(null);
  };

  const handleDuplicate = async (testId: string) => {
    const newTest = await duplicateTest(testId);
    
    if (newTest) {
      setTests([...tests, newTest]);
    }
  };

  const handleEdit = (testId: string) => {
    navigate(`/dashboard/tests/${testId}`);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "closed":
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20";
      case "draft":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20";
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.test_title && test.test_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Test Management">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Actions Bar */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
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
                <DropdownMenuItem className="cursor-pointer">All Tests</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Active Tests</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Closed Tests</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Drafts</DropdownMenuItem>
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
                <DropdownMenuItem className="cursor-pointer">Most Candidates</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Name (A-Z)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="icon" variant="outline">
              <Calendar className="h-4 w-4" />
            </Button>
            
            <Button onClick={() => navigate('/dashboard/create-test')} className="sm:w-auto">
              Create Test
            </Button>
          </div>
        </motion.div>

        {/* Tests Table */}
        <motion.div variants={itemVariants} className="rounded-md border shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead className="hidden md:table-cell">Project ID</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.test_title}</TableCell>
                    <TableCell className="hidden md:table-cell">{test.project_id || 'N/A'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(test.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {test.candidate_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${statusColor(test.status)} w-fit capitalize`}
                      >
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleEdit(test.id)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleDuplicate(test.id)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => handleDelete(test.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No tests match your search</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this test? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted/50 p-4 rounded-md">
            <p className="font-medium">
              {tests.find(t => t.id === testToDelete)?.test_title}
            </p>
            <p className="text-sm text-muted-foreground">
              {tests.find(t => t.id === testToDelete)?.candidate_count} candidates assigned
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Delete Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TestManagement;
