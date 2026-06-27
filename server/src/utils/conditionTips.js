const triggerRules = [
  {
    condition: "acidity_gerd",
    pattern: /chilli|spicy|fried|coffee|cola|citrus|tomato/i,
    tip: "You logged reflux-trigger foods recently. Consider milder, lower-fat choices and avoid late heavy meals.",
  },
  {
    condition: "ibs",
    pattern: /onion|garlic|beans|lentil|milk|wheat|cabbage/i,
    tip: "Some logged foods can aggravate IBS for sensitive people. Track symptoms and discuss a low-FODMAP trial with a dietitian.",
  },
  {
    condition: "type_2_diabetes",
    pattern: /soda|juice|cake|sweet|candy|white bread|sugar/i,
    tip: "You logged fast carbohydrates recently. Pair carbs with protein/fibre and follow your clinician's glucose guidance.",
  },
  {
    condition: "high_cholesterol",
    pattern: /butter|cream|fried|sausage|bacon|pastry/i,
    tip: "You logged higher saturated-fat foods. Emphasise oats, pulses, nuts, olive oil, fruit, and vegetables.",
  },
  {
    condition: "hypertension",
    pattern: /crisps|chips|processed|pickle|salt|takeaway|instant/i,
    tip: "You logged salty or processed foods. Lower-sodium swaps can support blood pressure goals.",
  },
];

function buildConditionTips(conditions = [], foodLogs = []) {
  const tips = [];

  conditions.forEach((condition) => {
    const rule = triggerRules.find((item) => item.condition === condition);

    if (!rule) {
      return;
    }

    const matches = foodLogs.filter((log) => rule.pattern.test(`${log.foodItem} ${log.notes || ""}`));
    if (matches.length >= 2) {
      tips.push(rule.tip);
    }
  });

  if (!tips.length) {
    tips.push("No repeated condition-specific trigger pattern detected in recent food logs.");
  }

  return tips;
}

module.exports = {
  buildConditionTips,
};
