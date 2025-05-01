
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend for email sending
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client with admin privileges
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate a secure random password
function generatePassword(length = 10) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

interface CreateRecruiterRequest {
  email: string;
  role: string;
  hiringCount: number;
  leadId: string;
  companyId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("1");

  // Handle preflight CORS requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    console.log("2");
    const { email, role, hiringCount, leadId, companyId } = await req.json() as CreateRecruiterRequest;
    console.log("3");

    // Generate a random password for the new user
    const password = generatePassword();
    
    console.log("4");

    // Create a new user with the provided email and generated password
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    console.log("5");

    if (userError) {
      console.error("Error creating user:", userError);
      throw new Error(`Error creating user: ${userError.message}`);
    }

    // Add the user to the recruiter table with the lead ID
    if (userData.user) {
      await supabase.from("recruiter").insert({
        id: userData.user.id,
        lead_id: leadId,
      });

      // Create profile with company ID if provided
      if (companyId) {
        await supabase.from("profiles").insert({
          id: userData.user.id,
          company_id: companyId,
        });
      } else {
        await supabase.from("profiles").insert({
          id: userData.user.id,
        });
      }
    }

    // Send welcome email with login credentials
    const emailResult = await resend.emails.send({
      from: "CodeProbe <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to CodeProbe - Your Account is Ready",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">Welcome to CodeProbe!</h1>
          <p>Your account has been created and is ready to use. Here are your login credentials:</p>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p>Please sign in using the link below:</p>
          <a href="http://localhost:3000/signin" style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sign In Now</a>
          <p style="margin-top: 20px;">For security reasons, we recommend changing your password after your first login.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Thanks for choosing CodeProbe for your technical assessments!</p>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error("Error sending email:", emailResult.error);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in create-recruiter function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

// Start the server
serve(handler);
