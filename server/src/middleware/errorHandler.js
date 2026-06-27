function errorHandler(error, req, res, next) {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Request body contains invalid JSON" });
  }

  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: error.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
}

module.exports = errorHandler;
