import { OrderItem, Order } from "../models/orderItem.model";

/**
 * Estados possíveis para o ciclo de vida de um pedido no e-commerce.
 */
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

  /**
 * Grafo de regras para transições válidas de status de pedido.
 * Impede que o sistema pule etapas (ex: PENDING direto para SHIPPED).
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELED"],
  PAID: ["SHIPPED", "CANCELED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELED: [],
};

/**
 * Representação direta da tabela 'orders' do MySQL (snake_case).
 * O campo 'total_amount' vem como string do mysql2 por ser do tipo DECIMAL.
 */
export interface OrderRow {
  id: number;
  user_id: number;
  address_id: number | null;
  status: OrderStatus;
  total_amount: string; // DECIMAL vem como string do mysql2
  created_at: Date;
  updated_at: Date;
}

/**
 * Mapeia o registro do banco (OrderRow) para o modelo da aplicação (Order),
 * convertendo tipos e anexando os itens do pedido.
 */
export function mapOrderRowToOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    userId: row.user_id,
    addressId: row.address_id,
    status: row.status,
    totalAmount: Number(row.total_amount),
    items,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
