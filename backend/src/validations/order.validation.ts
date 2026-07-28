import { z } from "zod";

/**
 * Schema Zod para validação individual de cada item enviado na criação do pedido.
 */
export const createOrderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
});

/**
 * Schema Zod para validação da criação de um pedido completo.
 */
export const createOrderSchema = z.object({
  addressId: z.number().int().positive().optional(),
  items: z
    .array(createOrderItemSchema)
    .min(1, "O pedido deve conter ao menos um item"),
});

/**
 * Schema Zod para validação de alteração do status do pedido.
 */
export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
