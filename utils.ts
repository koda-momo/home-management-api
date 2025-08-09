import { Response } from 'express';
import { ApiResponse } from './types.js';

export function validateIdAndCount(
  id: unknown,
  count: unknown,
  res: Response
): { id: number; count: number } | null {
  if (!id || count === undefined || count === null) {
    res.status(400).json({
      status: 400,
      message: 'id and count are required',
      data: null,
    });
    return null;
  }

  if (typeof id !== 'number' || typeof count !== 'number') {
    res.status(400).json({
      status: 400,
      message: 'id and count must be numbers',
      data: null,
    });
    return null;
  }

  if (count <= 0) {
    res.status(400).json({
      status: 400,
      message: 'count must be positive',
      data: null,
    });
    return null;
  }

  return { id, count };
}

export function createErrorResponse<T>(
  status: number,
  message: string,
  data: T = null as T
): ApiResponse<T> {
  return { status, message, data };
}

export function createSuccessResponse<T>(
  message: string,
  data: T
): ApiResponse<T> {
  return { status: 200, message, data };
}
