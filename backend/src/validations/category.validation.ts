import { z } from "zod";

/**
 * Schema de validação para criação de categorias.
 */
export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(250).optional(),
});

/**
 * Schema de validação para atualização de categorias.
 * Torna todos os campos do schema de criação opcionais (.partial()).
 */
export const updateCategorySchema = createCategorySchema.partial();

// Extração automática das tipagens através do Zod
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
