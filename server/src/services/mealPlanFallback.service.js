const supplementSuggestions = {
  acidity_gerd: [
    {
      name: "Calcium-rich foods or clinician-approved calcium supplement",
      purpose: "Supports bone health, which can matter if reflux symptoms lead to long-term diet restriction.",
      relatedConditions: ["acidity_gerd"],
      caution: "Do not self-treat reflux with supplements. Ask a doctor or pharmacist before using antacids or calcium supplements, especially with kidney issues or other medicines.",
    },
  ],
  ibs: [
    {
      name: "Psyllium husk",
      purpose: "A soluble fibre option that some dietitians use to support bowel regularity.",
      relatedConditions: ["ibs"],
      caution: "Start only with clinician or dietitian guidance. Increase slowly with water and stop if pain, bloating, or constipation worsens.",
    },
  ],
  type_2_diabetes: [
    {
      name: "Vitamin D",
      purpose: "Supports general bone, muscle, and immune health when blood levels are low.",
      relatedConditions: ["type_2_diabetes"],
      caution: "Check blood levels and speak with your doctor. Supplements do not replace diabetes medication, glucose monitoring, or diet advice.",
    },
  ],
  high_cholesterol: [
    {
      name: "Plant sterols",
      purpose: "Often used in nutrition guidance to support healthy LDL cholesterol alongside a heart-healthy diet.",
      relatedConditions: ["high_cholesterol"],
      caution: "Ask your doctor first, especially if pregnant, breastfeeding, or using cholesterol medication. Not a replacement for prescribed treatment.",
    },
  ],
  hypertension: [
    {
      name: "Magnesium from food first",
      purpose: "Magnesium-rich foods can support general heart health when part of a balanced, lower-sodium diet.",
      relatedConditions: ["hypertension"],
      caution: "Avoid high-dose magnesium supplements unless advised by a clinician, especially with kidney disease, heart medicines, or blood pressure medication.",
    },
  ],
  lactose_intolerance: [
    {
      name: "Lactase enzyme",
      purpose: "Can help some people digest lactose-containing foods.",
      relatedConditions: ["lactose_intolerance"],
      caution: "Use only as directed. Persistent symptoms need medical review because they may not be caused by lactose alone.",
    },
  ],
  gluten_intolerance: [
    {
      name: "Iron, folate, vitamin D, or B12 if blood tests show low levels",
      purpose: "These nutrients can become low in some people with coeliac disease or restrictive diets.",
      relatedConditions: ["gluten_intolerance"],
      caution: "Use supplements based on blood tests and clinician advice. Coeliac disease requires strict gluten avoidance, not supplement substitutes.",
    },
  ],
  pcos: [
    {
      name: "Inositol",
      purpose: "Sometimes discussed in PCOS nutrition care for metabolic support.",
      relatedConditions: ["pcos"],
      caution: "Discuss with a doctor before use, especially if taking fertility treatment, diabetes medication, or if pregnant/trying to conceive.",
    },
  ],
  thyroid_issues: [
    {
      name: "Selenium",
      purpose: "Supports normal thyroid hormone metabolism when dietary intake is low.",
      relatedConditions: ["thyroid_issues"],
      caution: "Do not start thyroid supplements without medical advice. Excess selenium can be harmful, and thyroid conditions require blood-test monitoring.",
    },
  ],
};

function buildSupplements(conditions = []) {
  const selected = conditions.flatMap((condition) => supplementSuggestions[condition] || []);

  if (selected.length) {
    return selected;
  }

  return [
    {
      name: "Vitamin D",
      purpose: "Supports general bone, immune, and metabolic health when sunlight exposure or intake is low.",
      relatedConditions: [],
      caution: "Check suitability with a clinician before long-term use, especially if pregnant, taking medicines, or managing a medical condition.",
    },
  ];
}

function buildFallbackMealPlan(profile) {
  const totalCalories = profile.targetCalories || 1800;
  const mealCalories = {
    breakfast: Math.round(totalCalories * 0.25),
    snack_1: Math.round(totalCalories * 0.1),
    lunch: Math.round(totalCalories * 0.3),
    snack_2: Math.round(totalCalories * 0.1),
    dinner: Math.round(totalCalories * 0.25),
  };

  return {
    meals: [
      {
        mealType: "breakfast",
        name: "Oats with berries and chia",
        ingredients: ["rolled oats", "low-fat milk or fortified alternative", "blueberries", "chia seeds"],
        calories: mealCalories.breakfast,
        proteinG: 18,
        carbsG: 58,
        fatG: 12,
        keyNutrients: ["fibre", "magnesium", "slow-release carbohydrates"],
        preparationTip: "Cook oats gently and avoid heavy spice or fried toppings.",
        recipe: {
          prepTimeMinutes: 5,
          cookTimeMinutes: 8,
          steps: [
            "Add oats and milk to a small pan.",
            "Simmer gently until creamy.",
            "Top with blueberries and chia seeds before serving.",
          ],
        },
      },
      {
        mealType: "snack_1",
        name: "Apple slices with unsweetened yoghurt",
        ingredients: ["apple", "plain yoghurt or lactose-free yoghurt"],
        calories: mealCalories.snack_1,
        proteinG: 9,
        carbsG: 28,
        fatG: 3,
        keyNutrients: ["calcium", "fibre"],
        preparationTip: "Use lactose-free yoghurt if lactose intolerance is selected.",
        recipe: {
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          steps: [
            "Slice the apple into wedges.",
            "Spoon yoghurt into a bowl.",
            "Serve together as a light snack.",
          ],
        },
      },
      {
        mealType: "lunch",
        name: "Quinoa vegetable bowl",
        ingredients: ["quinoa", "cucumber", "carrot", "spinach", "chickpeas", "olive oil"],
        calories: mealCalories.lunch,
        proteinG: 24,
        carbsG: 72,
        fatG: 16,
        keyNutrients: ["plant protein", "folate", "potassium"],
        preparationTip: "Keep the dressing mild and avoid chilli-heavy sauces.",
        recipe: {
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          steps: [
            "Cook quinoa according to packet instructions.",
            "Chop cucumber, carrot, and spinach.",
            "Mix quinoa, vegetables, chickpeas, and olive oil in a bowl.",
          ],
        },
      },
      {
        mealType: "snack_2",
        name: "Carrot sticks with hummus",
        ingredients: ["carrot", "hummus"],
        calories: mealCalories.snack_2,
        proteinG: 7,
        carbsG: 24,
        fatG: 8,
        keyNutrients: ["beta-carotene", "healthy fats"],
        preparationTip: "Choose a mild hummus if acidity or IBS symptoms are present.",
        recipe: {
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          steps: [
            "Wash and cut carrots into sticks.",
            "Portion hummus into a small bowl.",
            "Dip carrots into hummus and serve.",
          ],
        },
      },
      {
        mealType: "dinner",
        name: "Lentil soup with brown rice",
        ingredients: ["red lentils", "brown rice", "courgette", "spinach", "low-sodium stock"],
        calories: mealCalories.dinner,
        proteinG: 26,
        carbsG: 76,
        fatG: 9,
        keyNutrients: ["iron", "protein", "complex carbohydrates"],
        preparationTip: "Use low-sodium stock and cook lentils until soft for easier digestion.",
        recipe: {
          prepTimeMinutes: 10,
          cookTimeMinutes: 25,
          steps: [
            "Rinse lentils and add them to a pan with low-sodium stock.",
            "Simmer with chopped courgette until lentils are soft.",
            "Stir in spinach and serve with cooked brown rice.",
          ],
        },
      },
    ],
    foodsToAvoid: ["deep-fried foods", "sugary drinks", "very spicy sauces"],
    conditionTips: [
      "Keep meals regular and balanced across the day.",
      "Adjust portions with your clinician if you have a diagnosed medical condition.",
    ],
    supplements: buildSupplements(profile.conditions),
  };
}

module.exports = {
  buildFallbackMealPlan,
};
