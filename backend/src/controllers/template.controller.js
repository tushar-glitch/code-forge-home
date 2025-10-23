
const templates = [
  {
    id: 'react-starter',
    name: 'React Starter',
    description: 'A basic React project with a simple component.',
    template_language: 'react',
    technology: 'react',
    files_json: {
      'index.js': 'import React from "react";\nimport ReactDOM from "react-dom";\n\nfunction App() {\n  return <h1>Hello, World!</h1>;\n}\n\nReactDOM.render(<App />, document.getElementById("root"));',
      'index.html': '<div id="root"></div>',
    },
    dependencies: { "react": "^17.0.2", "react-dom": "^17.0.2" },
    test_files_json: {},
  },
  {
    id: 'node-starter',
    name: 'Node.js API Starter',
    description: 'A basic Node.js project with an Express server.',
    template_language: 'node',
    technology: 'node',
    files_json: {
      'index.js': 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello, World!");\n});\n\napp.listen(3000, () => {\n  console.log("Server is running on port 3000");\n});',
    },
    dependencies: { "express": "^4.17.1" },
    test_files_json: {},
  },
  {
    id: 'python-starter',
    name: 'Python Flask Starter',
    description: 'A basic Python project with a Flask server.',
    template_language: 'python',
    technology: 'python',
    files_json: {
      'app.py': 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello_world():\n    return "Hello, World!"\n',
    },
    dependencies: { "flask": "^2.0.1" },
    test_files_json: {},
  },
];

const getTemplates = async (req, res) => {
  const { domain, technology, page = 1, limit = 10 } = req.query;

  let filteredTemplates = templates;

  if (technology) {
    filteredTemplates = filteredTemplates.filter(t => t.technology === technology);
  }

  if (domain) {
    if (domain === 'frontend') {
      filteredTemplates = filteredTemplates.filter(t => ['react', 'vue', 'angular'].includes(t.technology));
    } else if (domain === 'backend') {
      filteredTemplates = filteredTemplates.filter(t => t.technology === 'node');
    }
  }

  const paginatedTemplates = filteredTemplates.slice((page - 1) * limit, page * limit);

  try {
    res.status(200).json({
      templates: paginatedTemplates, 
      totalPages: Math.ceil(filteredTemplates.length / limit) 
    });
  } catch (error) {
    console.error('Error fetching code project templates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTemplates,
};
