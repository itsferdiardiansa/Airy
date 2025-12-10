import { Response } from 'express';

interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
  meta?: any;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Operation successful',
    meta?: any
  ): Response {
    const payload: IApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(200).json(payload);
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully'
  ): Response {
    const payload: IApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(201).json(payload);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static badRequest(
    res: Response,
    message = 'Bad Request',
    code = 'BAD_REQUEST',
    error?: any
  ): Response {
    const payload: IApiResponse<null> = {
      success: false,
      message,
      code,
      error,
    };
    return res.status(400).json(payload);
  }

  static unauthorized(
    res: Response,
    message = 'Unauthorized',
    code = 'UNAUTHORIZED'
  ): Response {
    const payload: IApiResponse<null> = {
      success: false,
      message,
      code,
    };
    return res.status(401).json(payload);
  }

  static forbidden(
    res: Response,
    message = 'Forbidden',
    code = 'FORBIDDEN'
  ): Response {
    const payload: IApiResponse<null> = {
      success: false,
      message,
      code,
    };
    return res.status(403).json(payload);
  }

  static notFound(
    res: Response,
    message = 'Resource not found',
    code = 'NOT_FOUND'
  ): Response {
    const payload: IApiResponse<null> = {
      success: false,
      message,
      code,
    };
    return res.status(404).json(payload);
  }

  static error(
    res: Response,
    message = 'Internal Server Error',
    code = 'INTERNAL_SERVER_ERROR',
    error?: any
  ): Response {
    const payload: IApiResponse<null> = {
      success: false,
      message,
      code,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    };
    return res.status(500).json(payload);
  }
}
