const env = require("../config/env");

async function answerUserQuestion({ message, profile }) {
  if (!env.openaiApiKey) {
    return "AI assistant is not configured yet. Add OPENAI_API_KEY in server/.env, then restart the backend.";
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiModel,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are NutriAI's careful health and nutrition assistant. Answer clearly, safely, and practically. You are not a doctor. Do not diagnose, prescribe, or replace professional medical advice. For urgent symptoms or medication decisions, advise contacting a clinician.",
        },
        {
          role: "user",
          content: `User profile context: ${JSON.stringify(profile || {})}\n\nQuestion: ${message}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Assistant could not generate a response");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I could not generate an answer. Please try again.";
}

module.exports = {
  answerUserQuestion,
};
