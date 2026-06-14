const mongoose = require("mongoose");

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message:
      "Database is not connected. Check your MongoDB Atlas connection string and Network Access IP allowlist.",
  });
}

module.exports = requireDatabase;
