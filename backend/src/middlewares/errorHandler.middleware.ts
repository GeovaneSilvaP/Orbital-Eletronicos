import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

/**
 * Middleware centralizador que intercepta erros disparados de qualquer rota da aplicação.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Cenário A: O erro foi disparado de propósito por nós (ex: E-mail em uso)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Cenário B: Erro desconhecido ou falha sistêmica (ex: Banco caiu, NullPointer)
  console.error("[ERRO NÃO TRATADO]", err); // Exibe no log do servidor para diagnóstico interno

  // Oculta detalhes técnicos do cliente externo por segurança
  return res.status(500).json({
    message: "Erro interno no servidor",
  });
}
