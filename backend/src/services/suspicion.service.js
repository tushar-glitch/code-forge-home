const axios = require('axios');

const suspicionEngine = async (files, ws) => {
  try {
    const code = Object.entries(files).map(([path, content]) => `// ${path}\n${content}`).join('\n\n');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a proctor for a coding test. A candidate is writing code. Based on the current state of their code, ask a simple, open-ended question to check their understanding. The question should be about the code they have written. The code is:\n\n${code}`,
              },
            ],
          },
        ],
      }
    );

    const question = response.data.candidates[0].content.parts[0].text;
    // const question = "Can you explain the code you have written so far?";
    ws.send(JSON.stringify({ type: 'question', payload: { question } }));
  } catch (error) {
    console.error('Error generating question:', error);
    // Fallback to a generic question if the AI fails
    ws.send(JSON.stringify({ type: 'question', payload: { question: 'Can you explain the code you have written so far?' } }));
  }
};

module.exports = {
  suspicionEngine,
};
