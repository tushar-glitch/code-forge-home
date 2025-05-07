
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Octokit } from "https://esm.sh/octokit@3.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateRepoPayload {
  assignment_id: number;
  submission_id: number;
  project_files: Record<string, string>;
  test_id: number;
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
    const githubToken = Deno.env.get("GITHUB_TOKEN");

    if (!supabaseUrl || !supabaseServiceKey || !githubToken) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const octokit = new Octokit({ auth: githubToken });

    // Get the payload
    const payload = await req.json() as CreateRepoPayload;
    console.log("Received create repo request:", { 
      assignment_id: payload.assignment_id,
      submission_id: payload.submission_id,
      test_id: payload.test_id,
      files_count: Object.keys(payload.project_files).length
    });

    // Get user info from GitHub to identify the repo owner
    const { data: githubUser } = await octokit.rest.users.getAuthenticated();
    
    // Generate a unique repository name
    const repoName = `candidate-submission-${payload.assignment_id}-${payload.submission_id}`;
    
    // Create a new repository
    const { data: repo } = await octokit.rest.repos.createInOrg({
      org: githubUser.login,
      name: repoName,
      private: true,
      auto_init: false,
      description: `Automated test repository for assignment ${payload.assignment_id}, submission ${payload.submission_id}`
    });

    console.log(`Created repository: ${repo.html_url}`);

    // Get test configurations for this test
    const { data: testConfigs, error: testConfigError } = await supabase
      .from("test_configurations")
      .select("*")
      .eq("test_id", payload.test_id)
      .eq("enabled", true);
    
    if (testConfigError) {
      throw testConfigError;
    }

    // Create GitHub workflow file
    const workflowYml = `
name: Run Playwright Tests

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Playwright Tests
        run: npx playwright test
        id: playwright
        continue-on-error: true
      
      - name: Capture Test Results
        if: always()
        run: |
          echo "PLAYWRIGHT_STATUS=\${{ steps.playwright.outcome }}" >> $GITHUB_ENV
          echo "PLAYWRIGHT_REPORT=\$(cat playwright-report/results.json 2>/dev/null || echo '{}')" >> $GITHUB_ENV
          echo "PLAYWRIGHT_LOGS=\$(cat playwright.log 2>/dev/null || echo 'No logs available')" >> $GITHUB_ENV
      
      - name: Upload Screenshots
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-screenshots
          path: playwright-report/screenshots
          retention-days: 30
      
      - name: Send Results Back
        if: always()
        run: |
          TEST_STATUS="failed"
          if [[ "\${{ env.PLAYWRIGHT_STATUS }}" == "success" ]]; then
            TEST_STATUS="passed"
          fi
          
          curl -X POST https://qcxnesarokpcrzkhlqwv.supabase.co/functions/v1/github-webhook \\
            -H "Content-Type: application/json" \\
            -d "{
              \\"submission_id\\": ${payload.submission_id},
              \\"assignment_id\\": ${payload.assignment_id},
              \\"status\\": \\"\${TEST_STATUS}\\",
              \\"test_output\\": \${PLAYWRIGHT_REPORT},
              \\"logs\\": \\"\${PLAYWRIGHT_LOGS}\\"
            }"
    `;

    // Create the project structure in the repository
    let mainCommitSha = '';
    
    // Create base project files
    for (const [filePath, content] of Object.entries(payload.project_files)) {
      // Skip non-essential files
      if (filePath.includes("node_modules/") || filePath.startsWith(".git/")) {
        continue;
      }

      try {
        const { data } = await octokit.rest.repos.createOrUpdateFileContents({
          owner: githubUser.login,
          repo: repoName,
          path: filePath.startsWith("/") ? filePath.substring(1) : filePath,
          message: `Add ${filePath}`,
          content: btoa(content),
          branch: "main"
        });

        if (!mainCommitSha) {
          mainCommitSha = data.commit.sha;
        }
      } catch (error) {
        console.error(`Error creating file ${filePath}:`, error.message);
        // Continue with other files if one fails
      }
    }

    // Create the GitHub workflow file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubUser.login,
      repo: repoName,
      path: ".github/workflows/playwright.yml",
      message: "Add GitHub Actions workflow for Playwright tests",
      content: btoa(workflowYml),
      branch: "main"
    });

    // Create the Playwright config and test files
    const playwrightConfig = `
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure',
  },
  projects: [
    { 
      name: 'chromium', 
      use: { ...devices['Desktop Chrome'] } 
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
`;

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubUser.login,
      repo: repoName,
      path: "playwright.config.ts",
      message: "Add Playwright config",
      content: btoa(playwrightConfig),
      branch: "main"
    });

    // Create test directory and test files from test configurations
    for (const config of testConfigs) {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: githubUser.login,
        repo: repoName,
        path: `tests/${config.name.replace(/\s+/g, '-').toLowerCase()}.spec.ts`,
        message: `Add test: ${config.name}`,
        content: btoa(config.test_script),
        branch: "main"
      });
    }

    // Update the database with the GitHub repository URL
    const { error: updateError } = await supabase
      .from("test_assignments")
      .update({
        github_repo_url: repo.html_url,
        git_branch: "main"
      })
      .eq("id", payload.assignment_id);

    if (updateError) {
      throw updateError;
    }

    // Create initial test result entry
    const { error: testResultError } = await supabase
      .from("test_results")
      .insert({
        submission_id: payload.submission_id,
        assignment_id: payload.assignment_id,
        status: "running",
        logs: "Tests initiated. Waiting for GitHub Actions to complete."
      });

    if (testResultError) {
      throw testResultError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          repo_url: repo.html_url,
          repo_name: repoName,
          owner: githubUser.login,
          branch: "main"
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating GitHub repository:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
