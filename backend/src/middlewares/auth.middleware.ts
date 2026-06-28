import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

// Define a estrutura esperada de dentro do token decodificado
interface TokenPayload {
  id: string;
  role: string;
}

/**
 * Injeta a propriedade 'user' de forma global dentro do objeto Request do Express.
 * Permite que qualquer rota que rode após esse middleware saiba quem é o usuário logado.
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Intercepta a requisição e valida a existência e legitimidade do token JWT no cabeçalho.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Busca o cabeçalho Authorization (Ex: "Bearer eyJhbGciOi...")
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não fornecido", 401);
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Formato de token inválido", 401);
  }

  try {
    // Abre o token usando a assinatura secreta da aplicação
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    // Salva os dados do usuário decodificado dentro da requisição para uso posterior
    req.user = { id: decoded.id, role: decoded.role };

    return next(); // Libera a requisição para ir para o próximo middleware ou controller
  } catch (error) {
    throw new AppError("Token inválido ou expirado", 401);
  }
};
