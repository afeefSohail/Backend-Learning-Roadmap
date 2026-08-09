import { Response } from "express";

interface SendResponseOptions<T> {
    res: Response;
    code: number;
    message: string;
    data?: T;
}

export function sendResponse<T>({ res, code, message, data }: SendResponseOptions<T>) {
  return res.status(code).json({
    meta: { code, message },
    data: data ?? null,
  });
}