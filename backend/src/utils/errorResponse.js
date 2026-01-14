const errorResponse = (message, statusCode) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.name = "ErrorResponse";

  Error.captureStackTrace(error, errorResponse);

  return error;
};

module.exports = errorResponse;
