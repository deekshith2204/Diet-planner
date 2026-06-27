const env = require("../config/env");
const { buildFallbackMealPlan } = require("./mealPlanFallback.service");

const conditionLabels = {
  acidity_gerd: "Acidity / GERD",
  ibs: "IBS / bloating / gas",
  type_2_diabetes: "Type 2 Diabetes",
  high_cholesterol: "High cholesterol",
  hypertension: "Hypertension",
  lactose_intolerance: "Lactose intolerance",
  gluten_intolerance: "Gluten intolerance / Coeliac",
  pcos: "PCOS",
  thyroid_issues: "Thyroid issues",
};

function parseMealPlanContent(content) {
  const cleaned = content.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

function normalizeMealPlan(plan, profile) {
  const fallback = buildFallbackMealPlan(profile);
  const meals = Array.isArray(plan.meals) && plan.meals.length ? plan.meals : fallback.meals;

  return {
    meals: meals.map((meal, index) => ({
      mealType: meal.mealType || fallback.meals[index]?.mealType || "meal",
      name: meal.name || fallback.meals[index]?.name || "Balanced meal",
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      calories: Number(meal.calories) || fallback.meals[index]?.calories || 300,
      proteinG: Number(meal.proteinG) || 0,
      carbsG: Number(meal.carbsG) || 0,
      fatG: Number(meal.fatG) || 0,
      keyNutrients: Array.isArray(meal.keyNutrients) ? meal.keyNutrients : [],
      preparationTip: meal.preparationTip || "",
      recipe: {
        prepTimeMinutes:
          Number(meal.recipe?.prepTimeMinutes) || fallback.meals[index]?.recipe?.prepTimeMinutes || 10,
        cookTimeMinutes:
          Number(meal.recipe?.cookTimeMinutes) || fallback.meals[index]?.recipe?.cookTimeMinutes || 15,
        steps: Array.isArray(meal.recipe?.steps)
          ? meal.recipe.steps
          : fallback.meals[index]?.recipe?.steps || [],
      },
    })),
    foodsToAvoid: Array.isArray(plan.foodsToAvoid) ? plan.foodsToAvoid : fallback.foodsToAvoid,
    conditionTips: Array.isArray(plan.conditionTips) ? plan.conditionTips : fallback.conditionTips,
    supplements: Array.isArray(plan.supplements) ? plan.supplements : fallback.supplements,
  };
}

async function generateAiMealPlan(profile) {
  if (!env.openaiApiKey) {
    return { ...buildFallbackMealPlan(profile), generatedBy: "manual" };
  }

  const conditions = profile.conditions.map((condition) => conditionLabels[condition] || condition);
  const prompt = {
    age: profile.age,
    gender: profile.gender,
    goal: profile.goal,
    dietaryPreference: profile.dietaryPreference,
    medicalConditions: conditions,
    targetCalories: profile.targetCalories,
    bmi: profile.bmi,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiModel,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are a cautious clinical nutrition planning assistant. Generate educational meal plans only, avoid medical diagnosis, never prescribe treatment or claim to cure disease, and return valid JSON only. Supplement suggestions must be conservative, evidence-informed, food-first where possible, and must include doctor/pharmacist caution language.",
        },
        {
          role: "user",
          content: `Create a one-day meal plan for this profile: ${JSON.stringify(prompt)}. Return JSON with keys: meals, foodsToAvoid, conditionTips, supplements. meals must include breakfast, snack_1, lunch, snack_2, dinner. Each meal needs mealType, name, ingredients array, calories, proteinG, carbsG, fatG, keyNutrients array, preparationTip, and recipe object with prepTimeMinutes, cookTimeMinutes, steps array. supplements must be safe educational suggestions based on selected conditions, not prescriptions. Prefer food-first suggestions and common low-risk supplements only when relevant. Each supplement needs name, purpose, relatedConditions array, caution. The caution must advise checking with a doctor/pharmacist/dietitian and mention medicine interactions or condition-specific risks where relevant. Keep total calories near targetCalories and avoid foods likely to aggravate the listed conditions.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`OpenAI meal plan generation failed: ${body}`);
    error.statusCode = response.status;
    throw error;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty meal plan response");
  }

  return { ...normalizeMealPlan(parseMealPlanContent(content), profile), generatedBy: "ai" };
}

module.exports = {
  generateAiMealPlan,
};
