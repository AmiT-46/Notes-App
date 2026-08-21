function notFound(req, res) {
  res.status(404).json({ error: true, message: "Route not found" });
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ error: true, message: status >= 500 ? "Internal server error" : error.message || "Request failed" });
}

module.exports = { notFound, errorHandler };
