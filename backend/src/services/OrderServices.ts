import { OrderRepository } from "../repositories/OrderRepositories";
import { ProductRepository } from "../repositories/ProductRepository";
import { AddressRepository } from "../repositories/AddressRepositories";
import { ORDER_STATUS_TRANSITIONS, OrderStatus } from "../models/order.model";
import { Order } from "../models/orderItem.model";
import { CreateOrderInput } from "../validations/order.validation";
import { AppError } from "../errors/AppError";

/**
 * Camada de Regras de Negócio para processamento e controle de Pedidos.
 */
export class OrderService {
  /**
   * Retorna todos os pedidos da base de dados (Apenas Admin).
   */
  static async getAllAdmin(status: OrderStatus): Promise<Order[]> {
    return await OrderRepository.findAll(status);
  }

  /**
   * Obtém detalhes de um pedido validando as regras de permissão.
   */
  static async getById(
    id: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<Order> {
    const order = await OrderRepository.findById(id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // Regra de segurança: Cliente comum não visualiza pedido de terceiros
    if (!isAdmin && order.userId !== userId) {
      throw new AppError("Pedido não encontrado", 404);
    }

    return order;
  }

  /**
   * Retorna o histórico de compras do usuário logado.
   */
  static async getAllByUser(userId: number): Promise<Order[]> {
    return await OrderRepository.findAllByUserId(userId);
  }

  /**
   * Cria um novo pedido após validar posse do endereço e estoque/disponibilidade dos produtos.
   */
  static async create(userId: number, data: CreateOrderInput): Promise<Order> {
    // 1. Valida posse do endereço, se informado
    if (data.addressId) {
      const address = await AddressRepository.findById(data.addressId);
      if (!address || address.userId !== userId) {
        throw new AppError("Endereço informado não encontrado", 400);
      }
    }

    // 2. Valida cada produto: existe, está ativo, tem estoque suficiente
    const itemToCreate = [];

    for (const item of data.items) {
      const product = await ProductRepository.findById(item.productId);

      if (!product) {
        throw new AppError(`Produto ${item.productId} não encontrado`, 400);
      }

      if (!product.isActive) {
        throw new AppError(`Produto ${product.name} não está disponível`, 400);
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(
          `Estoque insuficiente para "${product.name}" (disponível: ${product.stockQuantity})`,
          400,
        );
      }

      itemToCreate.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        subtotal: Number((product.price * item.quantity).toFixed(2)),
      });
    }

    try {
      return await OrderRepository.create(
        userId,
        data.addressId ?? null,
        itemToCreate,
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("STOCK_UNAVAILABLE")
      ) {
        // Corrida de concorrência: estoque mudou entre a validação e a escrita
        throw new AppError(
          "Estoque insuficiente no momento da compra, tente novamente",
          409,
        );
      }
      throw error;
    }
  }

  /**
   * Executa a transição de status do pedido garantindo autorizações e ordenação lógica das etapas.
   */
  static async updateStatus(
    id: number,
    newStatus: OrderStatus,
    userId: number,
    isAdmin: boolean,
  ): Promise<Order> {
    const order = await this.getById(id, userId, isAdmin); // valida existência + posse

    // Regra de permissão: usuário comum só pode cancelar o próprio pedido
    if (!isAdmin) {
      if (newStatus !== "CANCELED") {
        throw new AppError(
          "Apenas administradores podem alterar este status",
          403,
        );
      }
    }

    // Regra de transição de estado — impede pular etapas (ex: PENDING -> DELIVERED)
    const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        `Não é possível mudar o status de "${order.status}" para "${newStatus}"`,
        400,
      );
    }

    const restoreStock = newStatus === "CANCELED";

    const updated = await OrderRepository.updateStatus(
      id,
      newStatus,
      restoreStock,
    );

    if (!updated) {
      throw new AppError("Pedido não encontrado", 404);
    }

    return updated;
  }
}
