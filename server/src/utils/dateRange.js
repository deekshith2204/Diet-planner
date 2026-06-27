function parseDate(value, fallback) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getDateRange(query) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const defaultFrom = new Date(today);
  defaultFrom.setDate(defaultFrom.getDate() - 13);
  defaultFrom.setHours(0, 0, 0, 0);

  const from = parseDate(query.from, defaultFrom);
  const to = parseDate(query.to, today);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

module.exports = {
  getDateRange,
};
