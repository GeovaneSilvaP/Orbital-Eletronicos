import { z } from "zod";

/**
 * Schema de validação para cadastrar um novo endereço.
 * Define limites de texto, formatação rigorosa de CEP e tratamento de caixa alta para UF.
 */
export const createAddressSchema = z.object({
  street: z.string().trim().min(3).max(150),
  number: z.string().trim().min(1).max(20),
  complement: z.string().trim().max(100).optional(),
  neighborhood: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100),
  state: z
    .string()
    .trim()
    .length(2, "UF deve ter 2 letras (ex: MA)")
    .toUpperCase(),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato esperado: 00000-000)"),
  isDefault: z.boolean().default(false),
});

/**
 * Schema para atualização parcial de endereço.
 * Torna os campos opcionais e exige que pelo menos um campo seja fornecido na requisição.
 */
export const updateAddressSchema = createAddressSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Ao menos um campo deve ser informado para atualização",
  });

// Extração dinâmica das tipagens derivadas dos schemas Zod
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
