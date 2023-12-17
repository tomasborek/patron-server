import express from 'express';
interface IHttpResponse {
  send: () => void;
}
interface IFormattedResponse {
  meta: {
    date: Date;
    status: number;
    message: string;
    pagination?: {
      page: number;
    };
  };
  data?: object;
}

type ResponseConfig = {
  res: express.Response;
  status: number;
  message: string;
  data?: object;
  pagination?: {
    page: number;
  };
};

type SubResponseConfig = {
  res: express.Response;
  status?: number;
  message?: string;
  data?: object;
  pagination?: {
    page: number;
  };
};

export default class HttpResponse implements IHttpResponse {
  private res: express.Response;
  private status: number;
  private message: string;
  private data?: object;
  private pagination?: {
    page: number;
  };
  constructor(data: ResponseConfig) {
    this.res = data.res;
    this.status = data.status;
    this.message = data.message;
    this.data = data.data;
    this.pagination = data.pagination;
  }

  public send = () => {
    const formattedResponse: IFormattedResponse = {
      meta: {
        date: new Date(),
        message: this.message,
        status: this.status,
        pagination: this.pagination,
      },
      data: this.data,
    };
    this.res.status(this.status).send(formattedResponse);
  };
}

export class SuccessResponse extends HttpResponse {
  constructor(data: SubResponseConfig) {
    super({
      res: data.res,
      status: 200,
      message: data.message || 'Success',
      data: data.data,
      pagination: data.pagination,
    });
  }
}
export class CreatedResponse extends HttpResponse {
  constructor(data: SubResponseConfig) {
    super({
      res: data.res,
      status: 201,
      message: data.message || 'Created',
      data: data.data,
      pagination: data.pagination,
    });
  }
}

export class NotFoundResponse extends HttpResponse {
  constructor(data: SubResponseConfig) {
    super({
      res: data.res,
      status: 404,
      message: data.message || 'Not found',
      data: data.data,
      pagination: data.pagination,
    });
  }
}

export class BadRequestResponse extends HttpResponse {
  constructor(data: SubResponseConfig) {
    super({
      res: data.res,
      status: 400,
      message: data.message || 'Bad request',
      data: data.data,
      pagination: data.pagination,
    });
  }
}

export class UnauthorizedResponse extends HttpResponse {
  constructor(data: SubResponseConfig) {
    super({
      res: data.res,
      status: 401,
      message: data.message || 'Unauthorized',
      data: data.data,
      pagination: data.pagination,
    });
  }
}

export class ForbiddenResponse extends HttpResponse {
  constructor(data: SubResponseConfig) {
    super({
      res: data.res,
      status: 403,
      message: data.message || 'Forbidden',
      data: data.data,
      pagination: data.pagination,
    });
  }
}

export class ServerErrorResponse extends HttpResponse {
  constructor(data: SubResponseConfig) {
    super({
      res: data.res,
      status: 500,
      message: data.message || 'Internal server error',
      data: data.data,
      pagination: data.pagination,
    });
  }
}
