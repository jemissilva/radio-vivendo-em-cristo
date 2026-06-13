import { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "../lib/auth";
import { AppError } from "../lib/errors";
import { AdminRole } from "../types";

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        role: AdminRole;
        email: string;
      };
    }
  }
}

export const requireAuth = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError(401, "Autenticação obrigatória"));
  }

  const token = authorization.slice("Bearer ".length);
  const payload = verifyAdminToken(token);
  request.admin = {
    id: payload.sub,
    role: payload.role,
    email: payload.email,
  };
  next();
};

export const requireRole =
  (...roles: AdminRole[]) =>
  (request: Request, _response: Response, next: NextFunction) => {
    if (!request.admin) {
      return next(new AppError(401, "Autenticação obrigatória"));
    }
    if (!roles.includes(request.admin.role)) {
      return next(new AppError(403, "Permissão insuficiente"));
    }
    next();
  };