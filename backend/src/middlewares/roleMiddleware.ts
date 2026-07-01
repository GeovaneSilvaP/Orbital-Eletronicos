import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; // populado pelo authMiddleware

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AppError("Acesso negado: permissão insuficiente", 403);
    }

    next();
  };
}