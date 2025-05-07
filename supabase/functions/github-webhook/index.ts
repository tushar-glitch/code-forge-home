
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  submission_id: number;
  assignment_id: number;
  status: "pending" | "running" | "passed" | "failed";
  test_output: any;
  logs: string;
  screenshot_urls?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the webhook payload
    const payload = await req.json() as WebhookPayload;
    console.log("Received GitHub webhook payload:", payload);

    // Validate required fields
    if (!payload.submission_id || !payload.assignment_id || !payload.status) {
      throw new Error("Missing required fields in webhook payload");
    }

    // Update the test results in the database
    const { data: testResult, error: testResultError } = await supabase
      .from("test_results")
      .insert({
        submission_id: payload.submission_id,
        assignment_id: payload.assignment_id,
        status: payload.status,
        test_output: payload.test_output,
        logs: payload.logs,
        screenshot_urls: payload.screenshot_urls || [],
      })
      .select()
      .single();

    if (testResultError) {
      throw testResultError;
    }

    // Update the submission status
    const { error: submissionError } = await supabase
      .from("submissions")
      .update({ 
        test_status: payload.status,
        test_results: payload.test_output
      })
      .eq("id", payload.submission_id);

    if (submissionError) {
      throw submissionError;
    }

    return new Response(
      JSON.stringify({ success: true, data: testResult }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
