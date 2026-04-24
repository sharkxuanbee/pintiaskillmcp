export class PintiaError extends Error {
  constructor(message: string, public readonly code: string, public readonly causeData?: unknown) {
    super(message);
    this.name = "PintiaError";
  }
}

export class UnauthorizedError extends PintiaError {
  constructor(message = "Not logged in or cookie expired", causeData?: unknown) {
    super(message, "UNAUTHORIZED", causeData);
    this.name = "UnauthorizedError";
  }
}

export class NetworkError extends PintiaError {
  constructor(message = "Network request failed", causeData?: unknown) {
    super(message, "NETWORK_ERROR", causeData);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends PintiaError {
  constructor(message = "Request timed out", causeData?: unknown) {
    super(message, "TIMEOUT", causeData);
    this.name = "TimeoutError";
  }
}

export class ApiResponseError extends PintiaError {
  constructor(message = "Pintia API returned an error", causeData?: unknown) {
    super(message, "API_RESPONSE_ERROR", causeData);
    this.name = "ApiResponseError";
  }
}

export class SchemaMismatchError extends PintiaError {
  constructor(message = "API response schema changed", causeData?: unknown) {
    super(message, "SCHEMA_MISMATCH", causeData);
    this.name = "SchemaMismatchError";
  }
}

export class UnsupportedOperationError extends PintiaError {
  constructor(message = "Operation is intentionally unsupported") {
    super(message, "UNSUPPORTED_OPERATION");
    this.name = "UnsupportedOperationError";
  }
}
