import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

/**
 * Controla o acesso às rotas baseado nos cargos/papéis permitidos.
 * @param allowedRoles Lista de papéis autorizados (Ex: ['ADMIN', 'MANAGER'])
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Segurança: Garante que o authMiddleware foi rodado antes deste
    if (!req.user) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // Verifica se o papel do usuário logado está incluso na lista de papéis permitidos para a rota
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Acesso não autorizado", 403);
    }
    
    // Autorizado! Segue o fluxo.
    return next();
  };
};