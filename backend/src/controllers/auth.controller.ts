import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../validations/auth.validation";
import { AuthService } from "../services/auth.service";

/**
 * Gerencia o endpoint HTTP dedicado à autenticação.
 */
export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Força o body da requisição a seguir estritamente as regras do Zod (.parse)
      const data = loginSchema.parse(req.body);
      const result = await AuthService.login(data);
      return res.status(200).json(result);
    } catch (error) {
      next(error); // Repassa erros de validação ou de credenciais para o errorHandler
    }
  }
}