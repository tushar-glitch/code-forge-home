
import React, { useState } from "react";
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
  Users
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
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Dummy data for tests
const testsData = [
  {
    id: "test-1",
    name: "React Frontend Bug Fix",
    template: "react-bug",
    dateCreated: "2025-04-15T10:00:00",
    assignedCandidates: 12,
    status: "active"
  },
  {
    id: "test-2",
    name: "Node.js API Implementation",
    template: "node-api",
    dateCreated: "2025-04-12T14:30:00",
    assignedCandidates: 8,
    status: "active"
  },
  {
    id: "test-3",
    name: "Full Stack App Debug",
    template: "full-stack",
    dateCreated: "2025-04-10T09:15:00",
    assignedCandidates: 5,
    status: "closed"
  },
  {
    id: "test-4",
    name: "Algorithm Optimization Challenge",
    template: "algorithm",
    dateCreated: "2025-04-05T16:45:00",
    assignedCandidates: 15,
    status: "active"
  },
  {
    id: "test-5",
    name: "React State Management",
    template: "react-bug",
    dateCreated: "2025-04-01T11:20:00",
    assignedCandidates: 0,
    status: "draft"
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

const TestManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);

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

  const confirmDelete = () => {
    // In a real app, you'd delete the test here
    toast({
      title: "Test deleted",
      description: "The test has been deleted successfully"
    });
    setIsDeleteDialogOpen(false);
  };

  const handleDuplicate = (testId: string) => {
    // In a real app, you'd duplicate the test here
    toast({
      title: "Test duplicated",
      description: "A copy of the test has been created"
    });
  };

  const handleEdit = (testId: string) => {
    // In a real app, you'd navigate to the edit page
    toast({
      title: "Editing test",
      description: "In a real app, this would take you to the edit page"
    });
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

  const filteredTests = testsData.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.template.toLowerCase().includes(searchTerm.toLowerCase())
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
                <TableHead className="hidden md:table-cell">Template</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell className="hidden md:table-cell capitalize">
                    {test.template.replace(/-/g, ' ')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(test.dateCreated)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {test.assignedCandidates}
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
              ))}
              {filteredTests.length === 0 && (
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
              {testsData.find(t => t.id === testToDelete)?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {testsData.find(t => t.id === testToDelete)?.assignedCandidates} candidates assigned
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
