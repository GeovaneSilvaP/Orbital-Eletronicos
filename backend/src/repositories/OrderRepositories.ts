import { poo } from "../config/database";
import { RowDataPacket, ResultSetHeader, PoolConnection } from "mysql2/promise";
import {
  OrderStatus,
  OrderRow,
  mapOrderRowToOrder,
} from "../models/order.model";
import {
  Order,
  OrderItemRow,
  mapOrderItemRowToOrderItem,
} from "../models/orderItem.model";

/**
 * Estrutura temporária dos itens calculados no Service antes da persistência.
 */
interface OrderItemToCreate {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

/**
 * Camada de Acesso a Dados para o gerenciamento de Pedidos e transações de estoque.
 */
export class OrderRepository {
  /**
   * Busca todos os pedidos do sistema (uso administrativo), permitindo filtro opcional por status.
   */
  static async findAll(status: OrderStatus): Promise<Order[]> {
    let query = "SELECT * FROM orders WHERE 1=1";
    const params: string[] = [];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";

    const [orderRows] = await poo.query<(OrderRow & RowDataPacket)[]>(
      query,
      params,
    );
    return this.attachItemsToOrders(orderRows);
  }

  /**
   * Localiza um pedido específico por ID e anexa seus respectivos itens.
   */
  static async findById(id: number): Promise<Order | null> {
    const [orderRows] = await poo.query<(OrderRow & RowDataPacket)[]>(
      "SELECT * FROM orders WHERE id = ? LIMIT 1",
      [id],
    );

    if (!orderRows[0]) return null;

    const [itemRows] = await poo.query<(OrderItemRow & RowDataPacket)[]>(
      "SELECT * FROM order_items WHERE order_id = ?",
      [id],
    );

    const items = itemRows.map(mapOrderItemRowToOrderItem);
    return mapOrderRowToOrder(orderRows[0], items);
  }

  /**
   * Busca o histórico de pedidos de um usuário específico.
   */
  static async findAllByUserId(userId: number): Promise<Order[]> {
    const [orderRows] = await poo.query<(OrderRow & RowDataPacket)[]>(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    );

    return this.attachItemsToOrders(orderRows);
  }

  /**
   * Cria um pedido e seus itens dentro de uma TRANSAÇÃO ACID.
   * Realiza a baixa imediata no estoque com verificação condicional no UPDATE para evitar Race Conditions.
   */
  static async create(
    userId: number,
    addressId: number | null,
    items: OrderItemToCreate[],
  ): Promise<Order> {
    const connection: PoolConnection = await poo.getConnection();

    try {
      await connection.beginTransaction();

      const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

      const [orderResult] = await connection.query<ResultSetHeader>(
        "INSERT INTO orders (user_id, address_id, status, total_amount) VALUES (?, ?, 'PENDING', ?)",
        [userId, addressId, totalAmount],
      );
      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query<ResultSetHeader>(
          "INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
          [
            orderId,
            item.productId,
            item.productName,
            item.unitPrice,
            item.quantity,
            item.subtotal,
          ],
        );

        // Baixa de estoque com lock otimista/condicional no MySQL
        const [stockResult] = await connection.query<ResultSetHeader>(
          "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?",
          [item.quantity, item.productId, item.quantity],
        );

        if (stockResult.affectedRows === 0) {
          // Nenhuma linha afetada = estoque insuficiente no momento exato da escrita
          throw new Error(`STOCK_UNAVAILABLE:${item.productId}`);
        }
      }

      await connection.commit();

      const created = await this.findById(orderId);
      if (!created) {
        throw new Error("Falha ao recuperar pedido recém-criado");
      }
      return created;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Atualiza o status do pedido e estorna o estoque caso o status seja CANCELED.
   */
  static async updateStatus(
    id: number,
    newStatus: OrderStatus,
    restoreStock: boolean,
  ): Promise<Order | null> {
    const connection: PoolConnection = await poo.getConnection();

    try {
      await connection.beginTransaction();

      if (restoreStock) {
        const [itemRows] = await connection.query<
          (OrderItemRow & RowDataPacket)[]
        >("SELECT * FROM order_items WHERE order_id = ?", [id]);

        for (const item of itemRows) {
          await connection.query(
            "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
            [item.quantity, item.product_id],
          );
        }
      }

      await connection.query<ResultSetHeader>(
        "UPDATE orders SET status = ? WHERE id = ?",
        [newStatus, id],
      );

      await connection.commit();
      return this.findById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Método auxiliar para carregar eficientemente todos os itens de múltiplos pedidos (evita N+1).
   */
  static async attachItemsToOrders(orderRows: OrderRow[]): Promise<Order[]> {
    if (orderRows.length === 0) return [];

    const orderIds = orderRows.map((row) => row.id);
    const [itemRows] = await poo.query<(OrderItemRow & RowDataPacket)[]>(
      "SELECT * FROM order_items WHERE order_id IN (?)",
      [orderIds],
    );

    return orderRows.map((orderRow) => {
      const items = itemRows
        .filter((item) => item.order_id === orderRow.id)
        .map(mapOrderItemRowToOrderItem);
      return mapOrderRowToOrder(orderRow, items);
    });
  }
}
