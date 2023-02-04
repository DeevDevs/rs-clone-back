class MyError extends Error {
  errorCode;
  errorMessage;
  constructor(message, code) {
    super(message);
    this.errorCode = code;
    this.errorMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = MyError;
