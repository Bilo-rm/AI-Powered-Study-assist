const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const askGPT = async (action, content) => {
  let prompt = "";

  if (action === "summary") {
    prompt = `Summarize the following lecture content in a professional, organized, and easy-to-read format. Use headings, subheadings, and bullet points where appropriate. Ensure that each key idea is presented clearly, and avoid using symbols or JSON-like formatting. Structure the summary to enhance readability and flow for a modern audience.\n\n${content}`;

  } else if (action === "flashcards") {
    prompt = `
Generate 5 flashcards from this lecture in the following JSON format:

[
  {
    "term": "Term 1",
    "definition": "Definition 1"
  },
  {
    "term": "Term 2",
    "definition": "Definition 2"
  }
]

Lecture content:
${content}
    `;
  } else if (action === "quiz") {
    prompt = `
Create 5 multiple-choice questions in JSON format from this lecture. Each object should include the question, 4 options, and the correct answer.

Example:
[
  {
    "question": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    "answer": "O(log n)"
  }
]

Lecture content:
${content}
    `;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

module.exports = { askGPT };
