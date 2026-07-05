const env = require("../config/env");

async function answerUserQuestion({ message, profile }) {
  if (!env.geminiApiKey) {
    return "AI assistant is not configured yet. Add GEMINI_API_KEY in server/.env, then restart the backend.";
  }

  const systemInstruction =
    "You are NutriAI's careful health and nutrition assistant. Answer clearly, safely, and practically. You are not a doctor. Do not diagnose, prescribe, or replace professional medical advice. For urgent symptoms or medication decisions, advise contacting a clinician.";

  const userContent = `User profile context: ${JSON.stringify(profile || {})}\n\nQuestion: ${message}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userContent }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini API error:", response.status, errorBody);

    if (response.status === 429) {
      throw new Error("Assistant is temporarily unavailable — the free tier rate limit was hit. Try again shortly.");
    }
    throw new Error(`Assistant could not generate a response (Gemini ${response.status})`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I could not generate an answer. Please try again."
  );
}

module.exports = {
  answerUserQuestion,
};