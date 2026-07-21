import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/ProductServices";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/products.validation";

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: {
        categoryId?: number;
        isActive?: boolean;
      } = {};

      if (req.query.categoryId !== undefined) {
        filters.categoryId = Number(req.query.categoryId);
      }

      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === "true";
      }
      const products = await ProductService.findAll(filters);
      res
        .status(200)
        .json({ message: "Todos os produtos encontrados", products });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const product = await ProductService.findById(id);
      res.status(200).json({ message: "Produto encontrado", product });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await ProductService.create(data);
      res.status(201).json({ message: "Produto criado com sucesso!", product });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = updateProductSchema.parse(req.body);
      const product = await ProductService.update(id, data);
      res
        .status(200)
        .json({ message: "Produto atualizado com sucesso!", product });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ProductService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
