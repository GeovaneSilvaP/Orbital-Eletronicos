import { z } from "zod";

/**
 * Regras estritas de validação para a rota de criação de usuários.
 */
export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(), // Aceita apenas estes dois papéis
});

/**
 * Regras flexíveis para a rota de atualização (todos os campos são opcionais, mas válidos).
 */
export const updateUserSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
  })
  // Garante que o usuário não mande um objeto vazio na tentativa de update {}
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser informado para atualização",
  });
