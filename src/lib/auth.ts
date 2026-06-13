import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminRole, AdminUser } from "../types";
import { AppError } from "./errors";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }
  return secret;
};

export interface AuthTokenPayload {
  sub: string;
  role: AdminRole;
  email: string;
}

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);

export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signAdminToken = (user: AdminUser) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    } satisfies AuthTokenPayload,
    getJwtSecret(),
    { expiresIn: "12h" },
  );

export const verifyAdminToken = (token: string) => {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    throw new AppError(401, "Token inválido");
  }
};