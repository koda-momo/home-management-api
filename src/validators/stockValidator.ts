import { Response } from 'express';

export const validateIdAndCount = (
  id: unknown,
  count: unknown,
  res: Response
): { id: number; count: number } | null => {
  if (id === undefined || count === undefined) {
    res.status(400).json({
      status: 400,
      message: 'id and count are required',
      data: null,
    });
    return null;
  }

  const parsedId = parseInt(id as string);
  const parsedCount = parseInt(count as string);

  if (isNaN(parsedId) || isNaN(parsedCount)) {
    res.status(400).json({
      status: 400,
      message: 'id and count must be valid numbers',
      data: null,
    });
    return null;
  }

  if (parsedCount <= 0) {
    res.status(400).json({
      status: 400,
      message: 'count must be a positive number',
      data: null,
    });
    return null;
  }

  return { id: parsedId, count: parsedCount };
};
