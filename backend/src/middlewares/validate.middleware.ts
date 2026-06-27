import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Retorna uma função middleware do Express configurada para validar o body usando um schema Zod.
 * @param schema O contrato Zod esperado para aquela rota.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Valida sem estourar exceção nativa (.safeParse)
    const result = schema.safeParse(req.body);

    // Se o formato enviado ferir as regras do schema, barra a requisição de imediato
    if (!result.success) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: result.error.flatten().fieldErrors, // Formata os erros campo por campo
      });
    }

    // Sobrescreve o body original apenas com os dados sanitizados e tipados pelo Zod
    req.body = result.data;
    next();
  };
};