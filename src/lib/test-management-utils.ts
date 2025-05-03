import { supabase } from "@/integrations/supabase/client";

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
