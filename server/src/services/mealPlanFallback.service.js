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
      },
    ],
    foodsToAvoid: ["deep-fried foods", "sugary drinks", "very spicy sauces"],
    conditionTips: [
      "Keep meals regular and balanced across the day.",
      "Adjust portions with your clinician if you have a diagnosed medical condition.",
    ],
  };
}

module.exports = {
  buildFallbackMealPlan,
};
