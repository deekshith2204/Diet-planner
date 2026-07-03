const env = require("../config/env");

const roughFoods = [
  { pattern: /oat/i, calories: 389, proteinG: 17, carbsG: 66, fatG: 7 },
  { pattern: /milk/i, calories: 50, proteinG: 3.4, carbsG: 5, fatG: 1.9 },
  { pattern: /whey/i, calories: 400, proteinG: 80, carbsG: 8, fatG: 6 },
  { pattern: /flax/i, calories: 534, proteinG: 18, carbsG: 29, fatG: 42 },
  { pattern: /chia/i, calories: 486, proteinG: 17, carbsG: 42, fatG: 31 },
  { pattern: /rice/i, calories: 130, proteinG: 2.7, carbsG: 28, fatG: 0.3 },
  { pattern: /chicken/i, calories: 165, proteinG: 31, carbsG: 0, fatG: 3.6 },
  { pattern: /egg/i, calories: 155, proteinG: 13, carbsG: 1.1, fatG: 11 },
  { pattern: /banana/i, calories: 89, proteinG: 1.1, carbsG: 23, fatG: 0.3 },
];

function scaleAmount(quantity = "") {
  const number = Number(String(quantity).match(/\d+(\.\d+)?/)?.[0] || 100);

  if (/kg/i.test(quantity)) return (number * 1000) / 100;
  if (/g|ml/i.test(quantity)) return number / 100;
  if (/scoop/i.test(quantity)) return (number * 30) / 100;
  if (/cup/i.test(quantity)) return (number * 240) / 100;
  if (/tbsp/i.test(quantity)) return (number * 15) / 100;
  if (/tsp/i.test(quantity)) return (number * 5) / 100;
  return number / 100;
}

function fallbackEstimate({ foodItem, quantity }) {
  const items = foodItem.split(",").map((item) => item.trim()).filter(Boolean);
  const totalAmount = scaleAmount(quantity);
  const amount = items.length > 1 ? totalAmount / items.length : totalAmount;

  const totals = items.reduce(
    (sum, item) => {
      const match = roughFoods.find((food) => food.pattern.test(item));
      const base = match || { calories: 120, proteinG: 4, carbsG: 18, fatG: 4 };
      return {
        calories: sum.calories + base.calories * amount,
        proteinG: sum.proteinG + base.proteinG * amount,
        carbsG: sum.carbsG + base.carbsG * amount,
        fatG: sum.fatG + base.fatG * amount,
      };
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  return {
    calories: Math.round(totals.calories),
    proteinG: Math.round(totals.proteinG),
    carbsG: Math.round(totals.carbsG),
    fatG: Math.round(totals.fatG),
    confidence: "rough",
    note: "Estimated from a small built-in nutrition table. Add an OpenAI key for a smarter estimate.",
  };
}

function parseJson(content) {
  return JSON.parse(content.replace(/```json|```/g, "").trim());
}

async function estimateNutrition(input) {
  if (!env.openaiApiKey) {
    return fallbackEstimate(input);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiModel,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "Estimate nutrition from foods and quantity. Return JSON only. Be realistic and conservative. No medical advice.",
        },
        {
          role: "user",
          content: `Estimate nutrition for: ${JSON.stringify(input)}. Return keys calories, proteinG, carbsG, fatG, confidence, note.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return fallbackEstimate(input);
  }

  const data = await response.json();
  const estimate = parseJson(data.choices?.[0]?.message?.content || "{}");

  return {
    calories: Math.round(Number(estimate.calories) || 0),
    proteinG: Math.round(Number(estimate.proteinG) || 0),
    carbsG: Math.round(Number(estimate.carbsG) || 0),
    fatG: Math.round(Number(estimate.fatG) || 0),
    confidence: estimate.confidence || "estimated",
    note: estimate.note || "AI-estimated nutrition. Verify packaged foods with labels.",
  };
}

module.exports = {
  estimateNutrition,
};
