interface IHttpError {
  status: number;
  message: string;
}

class HttpError implements IHttpError {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(404, message || 'Not found');
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(401, message || 'Unauthorized');
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string) {
    super(403, message || 'Forbidden');
  }
}

export class BadRequestError extends HttpError {
  constructor(message?: string) {
    super(400, message || 'Bad request');
  }
}

export class AlreadyExistsError extends HttpError {
  constructor(message?: string) {
    super(409, message || 'Already exists');
  }
}
