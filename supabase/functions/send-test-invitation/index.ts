
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TestInvitationRequest {
  email: string;
  testTitle: string;
  accessLink: string;
  firstName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, testTitle, accessLink, firstName }: TestInvitationRequest = await req.json();

    if (!email || !testTitle || !accessLink) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Hire10x <onboarding@resend.dev>",
      to: [email],
      subject: `You've been invited to take a coding test: ${testTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">Hi ${firstName || 'there'},</h1>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            You've been invited to take a coding assessment: <strong>${testTitle}</strong>.
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            This test will evaluate your technical abilities in a real-world scenario. 
            Please make sure to allocate enough time to complete the test in one sitting.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${accessLink}" 
               style="background-color: #3b82f6; color: white; padding: 12px 20px; 
                      text-decoration: none; border-radius: 4px; font-weight: bold;">
              Start Test
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            If the button above doesn't work, you can copy and paste the following link into your browser:
          </p>
          
          <p style="font-size: 14px; word-break: break-all; background-color: #f4f4f4; 
                    padding: 10px; border-radius: 4px; color: #333;">
            ${accessLink}
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555; margin-top: 30px;">
            Good luck!
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Best regards,<br>
            The Hire10x Team
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999;">
            This is an automated email. Please do not reply directly to this message.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Test invitation sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending test invitation:", error);
    return new Response(
      JSON.stringify({ 
        error: `Failed to send test invitation: ${error.message}` 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
