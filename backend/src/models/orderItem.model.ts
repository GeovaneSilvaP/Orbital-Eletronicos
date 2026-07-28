export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

  /**
 * Representação direta da tabela 'order_items' no MySQL.
 */
export interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
  created_at: Date;
}

/**
 * Modelo de domínio para um Item de Pedido na aplicação.
 */
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;
}

/**
 * Modelo de domínio para um Pedido na aplicação (camelCase).
 */
export interface Order {
  id: number;
  userId: number;
  addressId: number | null;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mapeia o registro do banco (OrderItemRow) para o modelo da aplicação (OrderItem).
 */
export function mapOrderItemRowToOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    subtotal: Number(row.subtotal),
    createdAt: row.created_at,
  };
}
