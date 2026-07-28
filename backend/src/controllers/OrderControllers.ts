import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/OrderServices";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validations/order.validation";

/**
 * Camada Controller para gerenciamento das requisições relativas a Pedidos.
 */
export class OrderControllers {
  /**
   * Lista todos os pedidos cadastrados na aplicação (Uso Administrativo).
   */
  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      const orders = await OrderService.getAllByUser(userId);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Detalha um pedido específico pelo parâmetro de rota `:id`.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user?.id);
      const isAdmin = req.user?.role === "ADMIN";
      const orders = await OrderService.getById(id, userId, isAdmin);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retorna a lista de pedidos do usuário autenticado.
   */
  static async getAllByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      res.status(200).json(userId);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria um novo pedido para o usuário autenticado.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      const data = createOrderSchema.parse(req.body);
      const orders = await OrderService.create(userId, data);
      res.status(201).json(orders);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza o status do pedido (Cancelamento por cliente ou alteração por Admin).
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user?.id);
      const isAdmin = req.user?.role === "ADMIN";
      const { status } = updateOrderStatusSchema.parse(req.body);
      const order = await OrderService.updateStatus(
        id,
        status,
        userId,
        isAdmin,
      );
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}
