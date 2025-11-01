

const challenges = [
  {
    name: "React Counter App",
    description: "A simple React application with a counter component.",
    technology: "react",
    files_json: {
      "package.json": `{
        "name": "react-counter-app",
        "version": "1.0.0",
        "description": "",
        "main": "src/index.js",
        "scripts": {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test",
          "eject": "react-scripts eject"
        },
        "dependencies": {
          "react": "18.2.0",
          "react-dom": "18.2.0",
          "react-scripts": "5.0.1"
        },
        "browserslist": {
          "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
          ],
          "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
          ]
        }
      }`,
      "src/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      "src/App.js": `import React from 'react';
import Counter from './Counter';

export default function App() {
  return (
    <div>
      <h1>React Counter App</h1>
      <Counter />
    </div>
  );
}`,
      "src/Counter.js": `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}`,
      "src/Counter.test.js": `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('renders counter and increments on click', () => {
  render(<Counterrrr />);
  
  const countElement = screen.getByText(/Count: 0/i);
  expect(countElement).toBeInTheDocument();
  
  const incrementButton = screen.getByText(/Increment/i);
  fireEvent.click(incrementButton);
  
  const updatedCountElement = screen.getByText(/Count: 1/i);
  expect(updatedCountElement).toBeInTheDocument();
});`
    },
    test_files_json: {
      "tests/e2e.spec.ts": `import { test, expect } from '@playwright/test';

test.describe('React Counter App', () => {
  test('should display the counter and increment on click', async ({ page }) => {
    await page.goto('/');

    // Check that the initial count is 0
    await expect(page.locator('h2')).toContainText('Count: 0');

    // Click the increment button
    await page.click('button:has-text("Increment")');

    // Check that the count has been incremented to 1
    await expect(page.locator('h2')).toContainText('Count: 1');
  });
});`
    }
  },
  {
    name: "Node.js Hello World API",
    description: "A basic Node.js API with a single endpoint.",
    technology: "node",
    files_json: {
      "package.json": `{
        "name": "node-hello-world-api",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
          "start": "node index.js"
        },
        "dependencies": {
          "express": "4.18.2"
        }
      }`,
      "index.js": 'const express = require(\'express\');\nconst app = express();\nconst port = 3000;\n\napp.get(\'/hello\', (req, res) => {\n  res.send(\'Hello World!\');\n});\n\napp.listen(port, () => {\n  console.log(`Server listening at http://localhost:${port}`);\n});'
    }
  }
];

module.exports = {
  challenges,
};
