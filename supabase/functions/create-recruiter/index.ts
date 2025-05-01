
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import pkg from "https://esm.sh/@supabase/supabase-js@2.43.3?dts";
const { createClient } = pkg;
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variable
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define the expected request body structure
interface CreateRecruiterRequest {
  email: string;
  role: string;
  hiringCount: number;
  leadId: string;
}

// Function to generate a random password
function generatePassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Main handler function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Parse the request body
    const { email, role, hiringCount, leadId }: CreateRecruiterRequest = await req.json();

    // Get Supabase URL and key from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    // Generate a password for the new user
    const password = generatePassword();

    // Create a new user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm the email
      user_metadata: { role, hiringCount }
    });

    if (authError) {
      throw new Error(`Error creating user: ${authError.message}`);
    }

    // Create a recruiter record linked to the lead
    if (authData?.user) {
      const { error: recruiterError } = await supabase
        .from("recruiter")
        .insert({ lead_id: leadId });

      if (recruiterError) {
        console.error("Error creating recruiter record:", recruiterError);
      }
    }

    // Send welcome email with password
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "hire10xdevs <noreply@resend.dev>",
      to: email,
      subject: "Welcome to hire10xdevs - Your Account Details",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366F1;">Welcome to hire10xdevs!</h1>
          <p>Your account has been created successfully. You can now sign in using the following credentials:</p>
          <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p>For security reasons, we recommend changing your password after your first login.</p>
          <a href="https://your-app-url.com/signin" style="display: inline-block; background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">Sign In Now</a>
          <p style="margin-top: 48px; font-size: 14px; color: #6B7280;">If you did not request this account, please ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "User created and welcome email sent" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-recruiter function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
