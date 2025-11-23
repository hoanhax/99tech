// Base HTTP error class
export class HTTPError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    // One field can have multiple errors example: {email: ["Invalid email format", "Email already taken"]}
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    // Used to set the name of the error
    this.name = this.constructor.name;

    // Used to set the stack trace, cut off the stack trace starting from the HTTPError constructor onward
    Error.captureStackTrace(this, this.constructor);
  }
}
