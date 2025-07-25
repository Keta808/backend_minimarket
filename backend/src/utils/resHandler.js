"use strict";

function respondSuccess( res, statusCode = 200, data = {}) {
  return res.status(statusCode).json({
    state: "Success",
    data,
  });
}


function respondError(
  res,
  statusCode = 500,
  message = "Couldnt process the request",
  details = {}
) {

 console.log("respondError:", { statusCode, message, details });
 
  return res.status(statusCode).json({
    state: "Error",
    message,
    details,
  });
}


function respondInternalError(
  res,
  statusCode = 500,
  message = "Couldnt process the request",
) {
  return res.status(statusCode).json({
    state: "Error",
    message,
  });
}

export { respondSuccess, respondError, respondInternalError };
