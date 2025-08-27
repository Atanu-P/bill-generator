function errorHandler(err, req, res, next) {
  console.error("GlobalErrorHandler:", {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";
  const errors = [];

  if (err instanceof SyntaxError && err.statusCode === 400 && "body" in err) {
    statusCode = 400;
    message = "JSON body error";
    errors.push({ message: err.message });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
  });
}

module.exports = errorHandler;
