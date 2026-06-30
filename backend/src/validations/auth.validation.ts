import { z } from "zod";

/**
 * Schema de validação para os dados obrigatórios no ato do login.
 */
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatório"),
});

// Extrai e exporta a tipagem automática gerada pelo Zod baseada no schema
export type LoginInput = z.infer<typeof loginSchema>;