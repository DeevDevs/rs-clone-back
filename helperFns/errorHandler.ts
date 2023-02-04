export function processError(error, req, res, next) {
  const errorCopy = distinguishError(error);
  res.status(errorCopy.errorCode).json({
    status: errorCopy.errorMessage,
  });
}

function distinguishError(error) {
  const errorCopy = JSON.parse(JSON.stringify(error));
  if (error.errorCode === 11000) {
    errorCopy.errorMessage = "User with such email already exists";
    errorCopy.errorCode = 400;
  }
  if (error.errorCode === 99000) {
    errorCopy.errorMessage = "Passwords have to match";
    errorCopy.errorCode = 400;
  }
  return errorCopy;
}
