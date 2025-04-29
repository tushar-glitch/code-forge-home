
import { FileType } from "@/types/file";

// Dummy file system with folder structure and example files
export const dummyFileSystem: FileType[] = [
  {
    id: "root",
    name: "project-root",
    isFolder: true,
    children: [
      {
        id: "pages",
        name: "pages",
        isFolder: true,
        children: [
          {
            id: "index-js",
            name: "index.js",
            isFolder: false,
            defaultContent: `// pages/index.js
import React from 'react';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="container">
      <Navbar />
      <h1>Welcome to our Application!</h1>
      <p>This is the homepage of our application.</p>
      
      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>Responsive Design</li>
          <li>Dark Mode Support</li>
          <li>Optimized Performance</li>
        </ul>
      </section>
    </div>
  );
}`
          },
          {
            id: "about-js",
            name: "about.js",
            isFolder: false,
            defaultContent: `// pages/about.js
import React from 'react';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="container">
      <Navbar />
      <h1>About Us</h1>
      <p>
        We are a team of dedicated developers working to build
        the best user experiences on the web.
      </p>
      
      <h2>Our Mission</h2>
      <p>
        To create intuitive, accessible, and beautiful web applications
        that solve real-world problems.
      </p>
    </div>
  );
}`
          }
        ]
      },
      {
        id: "components",
        name: "components",
        isFolder: true,
        children: [
          {
            id: "navbar-jsx",
            name: "Navbar.jsx",
            isFolder: false,
            defaultContent: `// components/Navbar.jsx
import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">MyApp</a>
      </div>
      
      <button 
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>
      
      <div className={\`navbar-menu \${isOpen ? 'is-open' : ''}\`}>
        <ul className="navbar-items">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;`
          }
        ]
      },
      {
        id: "utils",
        name: "utils",
        isFolder: true,
        children: [
          {
            id: "helpers-js",
            name: "helpers.js",
            isFolder: false,
            defaultContent: `// utils/helpers.js

/**
 * Format a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} A formatted date string
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounce a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} A debounced function
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`
          }
        ]
      },
      {
        id: "package-json",
        name: "package.json",
        isFolder: false,
        defaultContent: `{
  "name": "interview-project",
  "version": "1.0.0",
  "description": "Interview coding project",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^13.4.7"
  },
  "devDependencies": {
    "eslint": "^8.43.0",
    "eslint-config-next": "13.4.7",
    "typescript": "^5.1.6"
  }
}`
      },
      {
        id: "readme-md",
        name: "README.md",
        isFolder: false,
        defaultContent: `# Interview Project

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- \`pages/\` - Contains the page components
- \`components/\` - Contains reusable React components
- \`utils/\` - Contains utility functions

## The Challenge

In this coding interview, you need to:

1. Implement a responsive navigation component
2. Create a feature that allows users to toggle between light and dark mode
3. Fetch and display data from an API endpoint

Good luck!
`
      }
    ]
  }
];
