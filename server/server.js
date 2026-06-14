const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");

async function startServer() {
  app.listen(env.port, () => {
    console.log(`NutriAI API running on port ${env.port}`);
  });

  try {
    await connectDB();
  } catch {
    console.warn("NutriAI API is running, but database features are unavailable.");
  }
}

startServer();
