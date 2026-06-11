const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const rateLimiter = require("./middleware/rateLimiter");
const sanitizeRequest = require("./middleware/sanitizeRequest");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const apiRoutes = require("./routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);
app.use(rateLimiter);

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "NutriAI API",
  });
});

app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
