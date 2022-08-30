import { Response } from "express";

export const responseMessage = (
  res: Response,
  message: string,
  statusCode: number
) => {
  return res.status(statusCode).send(message);
};
