import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { AuthUser, AuthSession } from "@/context/AuthContext";

export interface Test {
  id: string;
  created_at: string;
  test_title: string;
  instructions: string;
  time_limit: number;
  primary_language: string;
  test_type?: string;
  question_list?: any;
  project_id: string | null;
  candidate_count?: number;
  status?: 'active' | 'closed' | 'draft';
  user_id?: string; // Add user_id field
}

export interface CodeProject {
  id: number;
  name: string | null;
  description: string | null;
  files_json: any;
  created_at: string;
}
export interface Candidate {
  id: number;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface TestAssignment {
  id: number;
  created_at: string;
  test_id: number;
  candidate_id: number;
  status: 'pending' | 'in-progress' | 'completed';
  test?: {
    id: number;
    test_title: string | null;
    time_limit: number | null;
    primary_language: string | null;
    instructions: string | null;
    created_at: string;
    project_id: number | null;
    company_id: number | null;
    user_id: string | null;
  };
  candidate?: Candidate;
  started_at: string | null;
  completed_at: string | null;
  access_link?: string | null;
}

// Helper to get user and session from localStorage
const getAuthData = (): { user: AuthUser | null; session: AuthSession | null } => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  
  if (token && userId && email) {
    return { user: { id: userId, email }, session: { token, userId } };
  }
  return { user: null, session: null };
};

export const createTest = async (testData: {
  test_title: string;
  time_limit: number;
  primary_language: string;
  instructions: string;
  files_json: any;
  dependencies: any;
  test_files_json: any;
  technology: string;
  challengeId?: string; // Add challengeId as an optional field
  test_configurations?: any[];
}): Promise<string | null> => {
  try {
    const { user, session } = getAuthData();
    
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a test",
        variant: "destructive"
      });
      return null;
    }

    const data = await api.post<any>(
      `/tests`,
      {
        test_title: testData.test_title,
        time_limit: testData.time_limit,
        primary_language: testData.primary_language,
        instructions: testData.instructions,
        files_json: testData.files_json,
        dependencies: testData.dependencies,
        test_files_json: testData.test_files_json,
        technology: testData.technology,
        user_id: user.id, // Add user ID to track test ownership
        ...(testData.challengeId && { challengeId: testData.challengeId }), // Conditionally add challengeId
        test_configurations: testData.test_configurations,
      },
      session.token
    );

    toast({
      title: "Test created successfully",
      description: "Your new test has been created",
    });
    return data.id.toString();
  } catch (error: any) {
    toast({
      title: "Error creating test",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    console.error("Error creating test:", error);
    return null;
  }
};

export const fetchProjects = async (): Promise<CodeProject[]> => {
  try {
    const { user, session } = getAuthData();
    
    if (!user || !session) return [];

    const data = await api.get<CodeProject[]>(
      `/code-projects`,
      session.token
    );

    return data || [];
  } catch (error: any) {
    toast({
      title: "Error loading projects",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const fetchTests = async (): Promise<Test[]> => {
  try {
    const { user, session } = getAuthData();
    
    if (!user || !session) return [];

    // Only fetch tests created by the current user
    const testsData = await api.get<Test[]>(
      `/tests?user_id=${user.id}`,
      session.token
    );

    // For each test, get the count of candidates
    const testsWithCounts = await Promise.all(testsData.map(async (test) => {
      const assignments = await api.get<any[]>(
        `/test-assignments?test_id=${test.id}`,
        session.token
      );
      
      return {
        ...test,
        id: test.id.toString(),
        project_id: test.project_id?.toString() || null,
        candidate_count: assignments ? assignments.length : 0,
        status: 'active' as 'active' | 'closed' | 'draft' // Fix the type issue with explicit typing
      };
    }));

    return testsWithCounts;
  } catch (error: any) {
    toast({
      title: "Error loading tests",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    console.error("Error fetching tests:", error);
    return [];
  }
};

// Function to create a new test assignment
export const createTestAssignment = async (testId: number, candidateId: number) => {
  try {
    const { session } = getAuthData();
    if (!session) {
      console.error('User not authenticated');
      return null;
    }

    const data = await api.post<any>(
      `/test-assignments`,
      {
        test_id: testId,
        candidate_id: candidateId,
        status: 'pending'
      },
      session.token
    );

    return data;
  } catch (error: any) {
    console.error('Error in createTestAssignment:', error);
    return null;
  }
};

// Function to update the status of a test assignment
export const updateAssignmentStatusById = async (assignmentId: number, status: 'pending' | 'in-progress' | 'completed', started: boolean = false, completed: boolean = false) => {
  try {
    const { session } = getAuthData();
    if (!session) {
      console.error('User not authenticated');
      return false;
    }

    let updates: { status: string, started_at?: string, completed_at?: string } = { status: status };

    if (started) {
      updates.started_at = new Date().toISOString();
    }

    if (completed) {
      updates.completed_at = new Date().toISOString();
    }

    await api.put<any>(
      `/test-assignments/${assignmentId}`,
      updates,
      session.token
    );

    return true;
  } catch (error: any) {
    console.error('Error updating assignment status:', error);
    return false;
  }
};

export const updateAssignmentStatus = async (accessLink: string, status: 'pending' | 'in-progress' | 'completed', started: boolean = false, completed: boolean = false) => {
  try {
    let updates: { status: string, started_at?: string, completed_at?: string } = { status: status };

    if (started) {
      updates.started_at = new Date().toISOString();
    }

    if (completed) {
      updates.completed_at = new Date().toISOString();
    }

    await api.put<any>(
      `/test-assignments/access/${accessLink}`,
      updates
    );

    return true;
  } catch (error: any) {
    console.error('Error updating assignment status by access link:', error);
    return false;
  }
};

// Function to get assignments for a specific candidate by email
export const getCandidateAssignments = async (candidateEmail: string) => {
  try {
    const { session } = getAuthData();
    if (!session) {
      console.error('User not authenticated');
      return [];
    }

    // First get the candidate ID using the email
    const candidates = await api.get<Candidate[]>(
      `/candidates?email=${candidateEmail}`,
      session.token
    );

    const candidate = candidates && candidates.length > 0 ? candidates[0] : null;

    if (!candidate) {
      console.error('Candidate not found');
      return [];
    }

    // Then get all assignments for this candidate with full test data
    const assignments = await api.get<TestAssignment[]>(
      `/test-assignments?candidate_id=${candidate.id}`,
      session.token
    );

    // For each assignment, fetch the test details
    const assignmentsWithTestData = await Promise.all(assignments.map(async (assignment) => {
      const test = await api.get<any>(
        `/tests/${assignment.test_id}`,
        session.token
      );
      return { ...assignment, test };
    }));
    
    // Log the assignments for debugging
    console.log('Assignments with test data:', assignmentsWithTestData);
    
    return assignmentsWithTestData || [];
  } catch (error: any) {
    console.error('Error in getCandidateAssignments:', error);
    return [];
  }
};

// Function to get specific assignment details by ID
export const getAssignmentDetails = async (assignmentId: number) => {
  try {
    const { session } = getAuthData();
    if (!session) {
      console.error('User not authenticated');
      return null;
    }
    
    const assignment = await api.get<TestAssignment>(
      `/test-assignments/${assignmentId}`,
      session.token
    );

    if (!assignment) {
      console.error('Assignment not found');
      return null;
    }

    // Fetch test details for the assignment
    const test = await api.get<any>(
      `/tests/${assignment.test_id}`,
      session.token
    );

    // Fetch candidate details for the assignment
    const candidate = await api.get<Candidate>(
      `/candidates/${assignment.candidate_id}`,
      session.token
    );

    return { ...assignment, test, candidate };
  } catch (error: any) {
    console.error('Error in getAssignmentDetails:', error);
    return null;
  }
};

export const deleteTest = async (testId: string): Promise<boolean> => {
  try {
    const { user, session } = getAuthData();
    
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete a test",
        variant: "destructive"
      });
      return false;
    }
    
    // First verify that the test belongs to the current user
    const test = await api.get<Test>(
      `/tests/${testId}`,
      session.token
    );
      
    if (!test) {
      toast({
        title: "Error deleting test",
        description: "Test not found",
        variant: "destructive"
      });
      return false;
    }
    
    // Check ownership
    if (test.user_id !== user.id) {
      toast({
        title: "Access denied",
        description: "You can only delete tests that you created",
        variant: "destructive"
      });
      return false;
    }

    await api.delete<any>(
      `/tests/${testId}`,
      session.token
    );

    toast({
      title: "Test deleted",
      description: "The test has been deleted successfully"
    });
    return true;
  } catch (error: any) {
    console.error("Error deleting test:", error);
    toast({
      title: "Error deleting test",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Duplicate a test
export const duplicateTest = async (testId: string): Promise<Test | null> => {
  try {
    const { user, session } = getAuthData();
    
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to duplicate a test",
        variant: "destructive"
      });
      return null;
    }
    
    // Get the test to duplicate
    const testToDuplicate = await api.get<Test>(
      `/tests/${testId}`,
      session.token
    );

    if (!testToDuplicate) {
      toast({
        title: "Error duplicating test",
        description: "Test not found",
        variant: "destructive"
      });
      return null;
    }
    
    // Verify ownership
    if (testToDuplicate.user_id !== user.id) {
      toast({
        title: "Access denied",
        description: "You can only duplicate tests that you created",
        variant: "destructive"
      });
      return null;
    }

    // Create a new test with the same data
    const newTest = await api.post<any>(
      `/tests`,
      {
        test_title: `${testToDuplicate.test_title} (Copy)`,
        project_id: parseInt(testToDuplicate.project_id || "0"), // Ensure project_id is number
        instructions: testToDuplicate.instructions,
        primary_language: testToDuplicate.primary_language,
        time_limit: testToDuplicate.time_limit,
        user_id: user.id // Ensure user ID is set for the duplicate
      },
      session.token
    );

    toast({
      title: "Test duplicated",
      description: "A copy of the test has been created"
    });

    return {
      ...newTest,
      id: newTest.id.toString(),
      project_id: newTest.project_id?.toString() || null,
      candidate_count: 0,
      status: 'draft'
    };
  } catch (error: any) {
    console.error("Error duplicating test:", error);
    toast({
      title: "Error duplicating test",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Add candidates
export const addCandidate = async (candidate: {
  email: string;
  first_name?: string;
  last_name?: string;
}, invitedById: string): Promise<number | null> => {
  try {
    const { session } = getAuthData();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add candidates",
        variant: "destructive"
      });
      return null;
    }

    console.log('addCandidate: Checking for existing candidate...', candidate.email, invitedById);
    // Check if candidate already exists for this inviter
    const existingCandidates = await api.get<Candidate[]>(
      `/candidates?email=${candidate.email}&invited_by=${invitedById}`,
      session.token
    );

    const existingCandidate = existingCandidates && existingCandidates.length > 0 ? existingCandidates[0] : null;

    // If candidate already exists, return the ID
    if (existingCandidate) {
      console.log('addCandidate: Found existing candidate:', existingCandidate.id);
      return existingCandidate.id;
    }

    console.log('addCandidate: Creating new candidate...', candidate.email);
    // Otherwise, create new candidate
    const newCandidate = await api.post<any>(
      `/candidates`,
      {
        email: candidate.email,
        first_name: candidate.first_name || null,
        last_name: candidate.last_name || null,
        invited_by: invitedById,
      },
      session.token
    );

    console.log('addCandidate: New candidate created:', newCandidate.id);
    return newCandidate.id;
  } catch (error: any) {
    console.error("Error adding candidate:", error);
    toast({
      title: "Error adding candidate",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Generate test assignment
export const generateTestAssignment = async (testId: string, candidateId: number): Promise<string | null> => {
  try {
    const { user, session } = getAuthData();
    
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create assignments",
        variant: "destructive"
      });
      return null;
    }
    
    // Verify test ownership before creating assignment
    const test = await api.get<Test>(
      `/tests/${testId}`,
      session.token
    );
      
    if (!test) {
      toast({
        title: "Error checking test",
        description: "Test not found",
        variant: "destructive"
      });
      return null;
    }
    
    // Check ownership
    if (test.user_id !== user.id) {
      toast({
        title: "Access denied",
        description: "You can only create assignments for tests that you own",
        variant: "destructive"
      });
      return null;
    }

    // Check if assignment already exists
    const existingAssignments = await api.get<TestAssignment[]>(
      `/test-assignments?test_id=${testId}&candidate_id=${candidateId}`,
      session.token
    );

    const existingAssignment = existingAssignments && existingAssignments.length > 0 ? existingAssignments[0] : null;

    // Generate a unique access link
    const accessLink = `${testId}-${candidateId}-${Math.random().toString(36).substring(2, 10)}`;

    const assignmentData = {
      test_id: parseInt(testId),
      candidate_id: candidateId,
      access_link: accessLink,
      status: 'pending'
    };

    if (existingAssignment) {
      // Update existing assignment
      await api.put<any>(
        `/test-assignments/${existingAssignment.id}`,
        assignmentData,
        session.token
      );
    } else {
      // Create new assignment
      await api.post<any>(
        `/test-assignments`,
        assignmentData,
        session.token
      );
    }

    return accessLink;
  } catch (error: any) {
    console.error("Error generating test assignment:", error);
    toast({
      title: "Error generating assignment",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Send email with test link
export const sendTestInvitation = async (
  email: string, 
  testTitle: string,
  accessLink: string,
  firstName?: string
): Promise<boolean> => {
  try {
    const { session } = getAuthData();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send invitations",
        variant: "destructive"
      });
      return false;
    }

    await api.post<any>(
      `/invitations/send-test-invitation`,
      {
        email,
        testTitle,
        accessLink,
        firstName: firstName || ''
      },
      session.token
    );

    toast({
      title: "Invitation sent",
      description: `Test invitation sent to ${email}`
    });
    return true;
  } catch (error: any) {
    console.error("Error sending test invitation:", error);
    toast({
      title: "Error sending invitation",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

// Function to get test results for a submission
export const getTestResults = async (submissionId: number) => {
  try {
    const { session } = getAuthData();
    if (!session) {
      console.error('User not authenticated');
      return null;
    }

    const data = await api.get<any[]>(
      `/test-results?submission_id=${submissionId}&_order=created_at&_sort=desc&_limit=1`,
      session.token
    );

    return data && data.length > 0 ? data[0] : null;
  } catch (error: any) {
    console.error('Error in getTestResults:', error);
    return null;
  }
};

// Function to get test configurations for a test
export const getTestConfigurations = async (testId: number) => {
  try {
    const { session } = getAuthData();
    if (!session) {
      console.error('User not authenticated');
      return [];
    }

    const data = await api.get<any[]>(
      `/test-configurations?test_id=${testId}&enabled=true`,
      session.token
    );

    return data;
  } catch (error: any) {
    console.error('Error in getTestConfigurations:', error);
    return [];
  }
};

// Function to create or update a test configuration
export const saveTestConfiguration = async (config: {
  id?: string;
  test_id: number;
  name: string;
  description?: string;
  test_script: string;
  enabled?: boolean;
}) => {
  try {
    const { session } = getAuthData();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to manage test configurations",
        variant: "destructive"
      });
      return null;
    }
    
    if (config.id) {
      // Update existing configuration
      const data = await api.put<any>(
        `/test-configurations/${config.id}`,
        {
          name: config.name,
          description: config.description,
          test_script: config.test_script,
          enabled: config.enabled !== undefined ? config.enabled : true,
          updated_at: new Date().toISOString()
        },
        session.token
      );

      return data;
    } else {
      // Create new configuration
      const data = await api.post<any>(
        `/test-configurations`,
        {
          test_id: config.test_id,
          name: config.name,
          description: config.description,
          test_script: config.test_script,
          enabled: config.enabled !== undefined ? config.enabled : true
        },
        session.token
      );

      return data;
    }
  } catch (error: any) {
    console.error("Error saving test configuration:", error);
    return null;
  }
};


export const getAssignmentDetailsByAccessLink = async (accessLink: string) => {
  try {
    const assignment = await api.get<any>(
      `/test-assignments/access/${accessLink}`
    );

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    return assignment;
  } catch (error: any) {
    console.error("Error in getAssignmentDetailsByAccessLink:", error);
    return null;
  }
};

export const submitTest = async (accessLink: string, code_snapshot: any) => {
  try {
    await api.post<any>(
      `/submissions`,
      {
        accessLink,
        code_snapshot,
      }
    );

    return true;
  } catch (error: any) {
    console.error('Error submitting test:', error);
    return false;
  }
};

export interface TestSummary {
  totalInvited: number;
  totalCompleted: number;
  averageScore: number;
}

export interface TestAssignmentWithResult {
  id: number;
  candidate: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
  status: 'pending' | 'in-progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
  submission_id: number | null;
  test_result: {
    id: string;
    status: string;
    score: number | null;
    evaluationStatus: string;
    created_at: string;
  } | null;
}

export const fetchTestSummary = async (testId: string): Promise<TestSummary | null> => {
  try {
    const { session } = getAuthData();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to view test summary",
        variant: "destructive"
      });
      return null;
    }

    const summary = await api.get<TestSummary>(
      `/dashboard/tests/${testId}/summary`,
      session.token
    );
    return summary;
  } catch (error: any) {
    console.error("Error fetching test summary:", error);
    toast({
      title: "Error fetching test summary",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

export const fetchTestAssignmentsWithResults = async (testId: string): Promise<TestAssignmentWithResult[]> => {
  try {
    const { session } = getAuthData();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to view test assignments",
        variant: "destructive"
      });
      return [];
    }

    const assignments = await api.get<TestAssignmentWithResult[]>(
      `/dashboard/tests/${testId}/assignments-results`,
      session.token
    );
    return assignments;
  } catch (error: any) {
    console.error("Error fetching test assignments with results:", error);
    toast({
      title: "Error fetching test assignments",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};