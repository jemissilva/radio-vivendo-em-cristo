import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors";

export const notFoundHandler = (_request: Request, response: Response) => {
  response.status(404).json({
    error: "Rota não encontrada",
  });
};

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      error: "Payload inválido",
      details: error.flatten(),
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.message,
    });
  }

  return response.status(500).json({
    error: "Erro interno do servidor",
  });
};