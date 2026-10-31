// An error with an HTTP status code. Throw it anywhere; the error middleware turns it into JSON.
export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors; // optional { field: "message" }
  }
}
