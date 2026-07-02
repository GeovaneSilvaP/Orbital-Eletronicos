import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

/**
 * Bloqueia ou autoriza requisições comparando o cargo do usuário logado contra uma lista de permissões.
 * Nota: Depende obrigatoriamente do `authMiddleware` ter sido executado previamente na rota.
 *
 * @param allowedRoles Array de strings contendo as roles aceitas (Ex: ['ADMIN'])
 */
export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; // populado pelo authMiddleware

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AppError("Acesso negado: permissão insuficiente", 403);
    }

    next();
  };
}
