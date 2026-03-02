export function errorHandler(err, _req, res, _next) {
  // Normalize unknown errors into consistent JSON responses.
  const status = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";
  res.status(status).json({ error: message });
}

