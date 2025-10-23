const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const main = async () => {
  console.log('Start seeding...');

  // Create Users
  const password = await bcrypt.hash('password123', 10);
  const users = [];

  // Create a specific recruiter user for testing
  const recruiterUser = await prisma.user.create({
    data: {
      email: 'recruiter@example.com',
      password: password,
      role: 'recruiter',
    },
  });
  users.push(recruiterUser);
  console.log(`Created recruiter user: ${recruiterUser.email}`);

  // Create DeveloperProfile for recruiterUser
  const recruiterProfile = await prisma.developerProfile.create({
    data: {
      userId: recruiterUser.id,
      username: faker.person.firstName().toLowerCase() + faker.number.int({ min: 10, max: 99 }),
      full_name: faker.person.fullName(),
      bio: faker.person.bio(),
    },
  });
  console.log(`Created developer profile for recruiter: ${recruiterProfile.username}`);

  // Create 4 more random users
  for (let i = 0; i < 4; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: password,
        role: 'candidate',
      },
    });
    users.push(user);
    // Optionally create a DeveloperProfile for these users too if needed for other relations
    await prisma.developerProfile.create({
      data: {
        userId: user.id,
        username: faker.person.firstName().toLowerCase() + faker.number.int({ min: 10, max: 99 }),
        full_name: faker.person.fullName(),
        bio: faker.person.bio(),
      },
    });
  }
  console.log(`Created ${users.length} users in total.`);

  // Create React Counter App Challenge
  const reactCounterChallenge = await prisma.challenge.create({
    data: {
      title: 'React Counter App',
      description: 'Build a simple React counter application with increment and decrement buttons.',
      problem_statement: 'Create a React component that displays a number and two buttons: \'Increment\' and \'Decrement\'. Clicking \'Increment\' should increase the number by 1, and clicking \'Decrement\' should decrease it by 1. The counter should start at 0.',
      difficulty: 'Easy',
      is_active: true,
      tags: ['react', 'frontend', 'javascript'],
      files_json: {
        'src/App.js': "import React from 'react';\nimport Counter from './Counter';\n\nfunction App() {\n  return (\n    <div className=\"App\">\n      <h1>My Counter App</h1>\n      <Counter />\n    </div>\n  );\n}\n\nexport default App;\n",
        'src/Counter.js': "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n      <button onClick={() => setCount(count - 1)}>Decrement</button>\n    </div>\n  );\n}\n\nexport default Counter;\n",
        'src/index.js': "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n",
      },
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.2.1',
        'vite': '^5.0.11',
      },
      test_files_json: {
        'tests/counter.spec.js': "import { test, expect } from '@playwright/test';\n\ntest('should increment and decrement the counter', async ({ page }) => {\n  await page.goto('http://localhost:8080'); // Assuming your React app runs on 8080\n\n  // Check initial count\n  await expect(page.locator('text=Count: 0')).toBeVisible();\n\n  // Increment\n  await page.click('text=Increment');\n  await expect(page.locator('text=Count: 1')).toBeVisible();\n\n  // Decrement\n  await page.click('text=Decrement');\n  await expect(page.locator('text=Count: 0')).toBeVisible();\n\n  // Decrement again\n  await page.click('text=Decrement');\n  await expect(page.locator('text=Count: -1')).toBeVisible();\n});\n",
      },
    },
  });
  console.log(`Created challenge: ${reactCounterChallenge.title}`);

  // Create a Test from the React Counter App Challenge
  const counterTest = await prisma.test.create({
    data: {
      test_title: reactCounterChallenge.title,
      instructions: reactCounterChallenge.description,
      problem_statement: reactCounterChallenge.problem_statement,
      time_limit: 30,
      primary_language: 'javascript',
      technology: 'react',
      files_json: reactCounterChallenge.files_json,
      dependencies: reactCounterChallenge.dependencies,
      test_files_json: reactCounterChallenge.test_files_json,
      challengeId: reactCounterChallenge.id,
      user_id: recruiterUser.id,
    },
  });
  console.log(`Created test: ${counterTest.test_title}`);

  // Create a Candidate invited by the recruiter
  const candidate1 = await prisma.candidate.create({
    data: {
      email: 'candidate1@example.com',
      first_name: 'Alice',
      last_name: 'Smith',
      invited_by: recruiterUser.id,
    },
  });
  console.log(`Created candidate: ${candidate1.email}`);

  // Create a TestAssignment
  const testAssignment1 = await prisma.testAssignment.create({
    data: {
      test_id: counterTest.id,
      candidate_id: candidate1.id,
      access_link: faker.string.uuid(),
      status: 'pending',
    },
  });
  console.log(`Created test assignment for ${candidate1.email} on ${counterTest.test_title}`);

  // Create a Submission for testAssignment1
  const submission1 = await prisma.submission.create({
    data: {
      assignment_id: testAssignment1.id,
      content: '// Candidate\'s submitted code for Counter App',
      code_snapshot: {
        'src/Counter.js': "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n      <button onClick={() => setCount(count - 1)}>Decrement</button>\n    </div>\n  );\n}\n\nexport default Counter;\n",
      },
      test_status: 'completed',
    },
  });
  console.log(`Created submission for assignment ${testAssignment1.id}`);

  // Create a TestResult for submission1
  const testResult1 = await prisma.testResult.create({
    data: {
      submission_id: submission1.id,
      assignment_id: testAssignment1.id,
      status: 'passed',
      score: 90,
      evaluationStatus: 'completed',
      test_output: {
        'summary': 'All tests passed',
        'details': 'Playwright output here',
      },
    },
  });
  console.log(`Created test result for submission ${submission1.id}`);

  // Create a TestConfiguration for the counterTest
  const testConfig1 = await prisma.testConfiguration.create({
    data: {
      test_id: counterTest.id,
      name: 'Default Playwright Config',
      test_script: 'npx playwright test',
      description: 'Standard Playwright test execution',
      enabled: true,
    },
  });
  console.log(`Created test configuration for ${counterTest.test_title}`);

  // Create some UserActivity entries for the recruiter
  await prisma.userActivity.create({
    data: {
      user_id: recruiterProfile.id, // Use recruiterProfile.id here
      activity_type: 'TEST_CREATED',
      title: `Created test: ${counterTest.test_title}`,
      details: { testId: counterTest.id },
    },
  });
  await prisma.userActivity.create({
    data: {
      user_id: recruiterProfile.id, // Use recruiterProfile.id here
      activity_type: 'CANDIDATE_INVITED',
      title: `Invited candidate: ${candidate1.email}`,
      details: { candidateId: candidate1.id, testId: counterTest.id },
    },
  });
  console.log('Created user activities.');

  console.log('Seeding finished.');
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
