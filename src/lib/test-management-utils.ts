import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Test {
  id: number;
  created_at: string;
  test_title: string;
  instructions: string;
  time_limit: number;
  primary_language: string;
  test_type: string;
  question_list: any;
  project_id: number;
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
  test?: Test;
  candidate?: Candidate;
  started_at: string | null;
  completed_at: string | null;
}

export const createTest = async (testData: {
  test_title: string;
  project_id: string;
  time_limit: number;
  primary_language: string;
  instructions: string;
  company_id?: string | null;
}): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .insert({
        test_title: testData.test_title,
        project_id: parseInt(testData.project_id),
        time_limit: testData.time_limit,
        primary_language: testData.primary_language,
        instructions: testData.instructions,
        company_id: testData.company_id ? parseInt(testData.company_id) : null
      })
      .select('id')
      .single();

    if (error) {
      toast({
        title: "Error creating test",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Test created successfully",
      description: "Your new test has been created",
    });
    return data.id.toString();
  } catch (error: any) {
    toast({
      title: "Error creating test",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    console.error("Error creating test:", error);
    return null;
  }
};

export const fetchProjects = async (): Promise<CodeProject[]> => {
  try {
    const { data, error } = await supabase
      .from('code_projects')
      .select('*');

    if (error) {
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const fetchTests = async (): Promise<Test[]> => {
  try {
    const { data: testsData, error: testsError } = await supabase
      .from('tests')
      .select('*');

    if (testsError) {
      toast({
        title: "Error loading tests",
        description: testsError.message,
        variant: "destructive"
      });
      return [];
    }

    // For each test, get the count of candidates
    const testsWithCounts = await Promise.all(testsData.map(async (test) => {
      const { count, error } = await supabase
        .from('test_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('test_id', test.id);
      
      return {
        ...test,
        id: test.id.toString(),
        project_id: test.project_id?.toString() || null,
        company_id: test.company_id?.toString() || null,
        candidate_count: count || 0,
        status: 'active' // Default status, you can customize this based on your needs
      };
    }));

    return testsWithCounts;
  } catch (error) {
    console.error("Error fetching tests:", error);
    return [];
  }
};

// Function to create a new test assignment
export const createTestAssignment = async (testId: number, candidateId: number) => {
  try {
    const { data, error } = await supabase
      .from('test_assignments')
      .insert([
        { test_id: testId, candidate_id: candidateId, status: 'pending' }
      ]);

    if (error) {
      console.error('Error creating test assignment:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createTestAssignment:', error);
    return null;
  }
};

// Function to update the status of a test assignment
export const updateAssignmentStatus = async (assignmentId: number, status: 'pending' | 'in-progress' | 'completed', started: boolean = false, completed: boolean = false) => {
  try {
    let updates: { status: string, started_at?: string, completed_at?: string } = { status: status };

    if (started) {
      updates.started_at = new Date().toISOString();
    }

    if (completed) {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('test_assignments')
      .update(updates)
      .eq('id', assignmentId);

    if (error) {
      console.error('Error updating assignment status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateAssignmentStatus:', error);
    return false;
  }
};

// Function to get assignments for a specific candidate by email
export const getCandidateAssignments = async (candidateEmail: string) => {
  try {
    // First get the candidate ID using the email
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', candidateEmail)
      .maybeSingle();

    if (candidateError || !candidate) {
      console.error('Error fetching candidate:', candidateError);
      return [];
    }

    // Then get all assignments for this candidate
    const { data: assignments, error: assignmentsError } = await supabase
      .from('test_assignments')
      .select(`
        *,
        test:tests(*),
        candidate:candidates(*)
      `)
      .eq('candidate_id', candidate.id);

    if (assignmentsError) {
      console.error('Error fetching candidate assignments:', assignmentsError);
      return [];
    }

    return assignments || [];
  } catch (error) {
    console.error('Error in getCandidateAssignments:', error);
    return [];
  }
};

// Function to get specific assignment details by ID
export const getAssignmentDetails = async (assignmentId: number) => {
  try {
    const { data, error } = await supabase
      .from('test_assignments')
      .select(`
        *,
        test:tests(*),
        candidate:candidates(*)
      `)
      .eq('id', assignmentId)
      .single();

    if (error) {
      console.error('Error fetching assignment details:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAssignmentDetails:', error);
    return null;
  }
};

export const deleteTest = async (testId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', parseInt(testId));

    if (error) {
      toast({
        title: "Error deleting test",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Test deleted",
      description: "The test has been deleted successfully"
    });
    return true;
  } catch (error) {
    console.error("Error deleting test:", error);
    return false;
  }
};

// Duplicate a test
export const duplicateTest = async (testId: string): Promise<Test | null> => {
  try {
    // Get the test to duplicate
    const { data: testToDuplicate, error: fetchError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', parseInt(testId))
      .single();

    if (fetchError) {
      toast({
        title: "Error duplicating test",
        description: fetchError.message,
        variant: "destructive"
      });
      return null;
    }

    // Create a new test with the same data
    const { data: newTest, error: insertError } = await supabase
      .from('tests')
      .insert({
        test_title: `${testToDuplicate.test_title} (Copy)`,
        project_id: testToDuplicate.project_id,
        company_id: testToDuplicate.company_id,
        instructions: testToDuplicate.instructions,
        primary_language: testToDuplicate.primary_language,
        time_limit: testToDuplicate.time_limit
      })
      .select()
      .single();

    if (insertError) {
      toast({
        title: "Error duplicating test",
        description: insertError.message,
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Test duplicated",
      description: "A copy of the test has been created"
    });

    return {
      ...newTest,
      id: newTest.id.toString(),
      project_id: newTest.project_id?.toString() || null,
      company_id: newTest.company_id?.toString() || null,
      candidate_count: 0,
      status: 'draft'
    };
  } catch (error) {
    console.error("Error duplicating test:", error);
    return null;
  }
};

// Add candidates
export const addCandidate = async (candidate: {
  email: string;
  first_name?: string;
  last_name?: string;
}): Promise<number | null> => {
  try {
    // Check if candidate already exists
    const { data: existingCandidate, error: checkError } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', candidate.email)
      .maybeSingle();

    if (checkError) {
      toast({
        title: "Error checking candidate",
        description: checkError.message,
        variant: "destructive"
      });
      return null;
    }

    // If candidate already exists, return the ID
    if (existingCandidate) {
      return existingCandidate.id;
    }

    // Otherwise, create new candidate
    const { data: newCandidate, error: insertError } = await supabase
      .from('candidates')
      .insert({
        email: candidate.email,
        first_name: candidate.first_name || null,
        last_name: candidate.last_name || null
      })
      .select('id')
      .single();

    if (insertError) {
      toast({
        title: "Error adding candidate",
        description: insertError.message,
        variant: "destructive"
      });
      return null;
    }

    return newCandidate.id;
  } catch (error) {
    console.error("Error adding candidate:", error);
    return null;
  }
};

// Generate test assignment
export const generateTestAssignment = async (testId: string, candidateId: number): Promise<string | null> => {
  try {
    // Check if assignment already exists
    const { data: existingAssignment, error: checkError } = await supabase
      .from('test_assignments')
      .select('*')
      .eq('test_id', parseInt(testId))
      .eq('candidate_id', candidateId)
      .maybeSingle();

    if (checkError) {
      toast({
        title: "Error checking assignment",
        description: checkError.message,
        variant: "destructive"
      });
      return null;
    }

    // If assignment already exists, return the access link
    if (existingAssignment?.access_link) {
      return existingAssignment.access_link;
    }

    // Generate a unique access link
    const accessLink = `${testId}-${candidateId}-${Math.random().toString(36).substring(2, 10)}`;

    // Create or update the assignment
    const assignment = {
      test_id: parseInt(testId),
      candidate_id: candidateId,
      access_link: accessLink,
      status: 'pending'
    };

    if (existingAssignment) {
      // Update existing assignment
      const { error: updateError } = await supabase
        .from('test_assignments')
        .update(assignment)
        .eq('id', existingAssignment.id);

      if (updateError) {
        toast({
          title: "Error updating assignment",
          description: updateError.message,
          variant: "destructive"
        });
        return null;
      }
    } else {
      // Create new assignment
      const { error: insertError } = await supabase
        .from('test_assignments')
        .insert(assignment);

      if (insertError) {
        toast({
          title: "Error creating assignment",
          description: insertError.message,
          variant: "destructive"
        });
        return null;
      }
    }

    return accessLink;
  } catch (error) {
    console.error("Error generating test assignment:", error);
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
    const { data, error } = await supabase.functions.invoke('send-test-invitation', {
      body: {
        email,
        testTitle,
        accessLink,
        firstName: firstName || ''
      }
    });

    if (error) {
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Invitation sent",
      description: `Test invitation sent to ${email}`
    });
    return true;
  } catch (error: any) {
    console.error("Error sending test invitation:", error);
    toast({
      title: "Error sending invitation",
      description: error.message || "An error occurred",
      variant: "destructive"
    });
    return false;
  }
};
