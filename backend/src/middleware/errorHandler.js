import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// One place that turns every error into a clean JSON response.
// Express recognises an error handler by its four parameters, so "_next" must stay.
export function errorHandler(error, req, res, _next) {
  let status = error.status || 500;
  let message = error.message || 'Something went wrong';
  let errors = error.errors;

  if (error.name === 'ValidationError' && error.errors) {
    // Mongoose validation: collect one message per field
    status = 400;
    message = 'Please fix the highlighted fields';
    errors = {};
    for (const [field, detail] of Object.entries(error.errors)) errors[field] = detail.message;
  } else if (error.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${error.path}`;
  } else if (error.code === 11000) {
    status = 409;
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'value';
    message = `That ${field} is already in use`;
    errors = { [field]: message };
  } else if (error.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON';
  }

  if (status >= 500) {
    console.error(error);
    if (env.isProduction) message = 'Something went wrong on the server';
  }

  res.status(status).json({ message, ...(errors ? { errors } : {}) });
}
