import { Request, Response, NextFunction } from "express";
import { AddressServices } from "../services/AddressServices";
import {
  createAddressSchema,
  updateAddressSchema,
} from "../validations/address.validation";

/**
 * Controller responsável pelas entradas/saídas das rotas de Endereços.
 * Extrai dados do token (req.user), faz a validação com Zod e responde as requisições HTTP.
 */
export class AddressControllers {
  /**
   * Retorna todos os endereços do usuário autenticado.
   */
  static async getAllByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      const address = await AddressServices.getAllByUserId(userId);
      return res
        .status(200)
        .json({ message: "Endereços encontrados", address });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca os detalhes de um endereço específico pelo ID na URL.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      const id = Number(req.params.id);
      const address = await AddressServices.findById(id, userId);
      return res.status(200).json({ message: "Endereço encontrado", address });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Valida o corpo da requisição e cadastra o novo endereço.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user?.id);
      const data = createAddressSchema.parse(req.body);
      const address = await AddressServices.create(userId, data);
      return res
        .status(201)
        .json({ message: "Endereço criado com sucesso", address });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza as informações de um endereço existente.
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user?.id);
      const data = updateAddressSchema.parse(req.body);
      const address = await AddressServices.update(id, userId, data);
      return res
        .status(200)
        .json({ message: "Endereço atualizado com sucesso", address });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove o endereço pelo ID. Retorna status HTTP 204 (No Content).
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user?.id);
      await AddressServices.delete(id, userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
