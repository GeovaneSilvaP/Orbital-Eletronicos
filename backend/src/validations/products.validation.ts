import { z } from "zod";

/**
 * Schema Zod para validação dos dados de criação de um novo produto.
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(150),
  description: z.string().trim().max(2000).optional(),
  sku: z
    .string()
    .trim()
    .min(1, "SKU é obrigatório")
    .max(100, "SKU deve ter no máximo 100 caracteres"),
  price: z.number().positive("Preço deve ser maior que zero"),
  stockQuantity: z.number().int().nonnegative().default(0),
  categoryId: z.number().int().positive("categoryId é obrigatório"),
  imageUrl: z.string().url("URL de imagem inválida").optional(),
  isActive: z.boolean().default(true),
});

/**
 * Schema Zod para atualização parcial de produtos.
 * Torna todos os campos do `createProductSchema` opcionais (.partial()) e exige
 * que pelo menos uma propriedade seja informada na requisição.
 */
export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Ao menos um campo deve ser informado para atualização",
  });

// Extração dinâmica das tipagens inferidas a partir dos schemas do Zod
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
