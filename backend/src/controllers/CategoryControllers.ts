import { CategoryServices } from "../services/CategoryServices";
import { Request, Response, NextFunction } from "express";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";

export class CategoryControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryServices.getAll();
      res.status(200).json(categories);
    } catch (error) {
      next();
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const category = await CategoryServices.getById(id);
      res.status(200).json({ message: "Categoria encontrado!", category });
    } catch (error) {
      next();
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCategorySchema.parse(req.body);
      const category = await CategoryServices.create(data);
      res
        .status(201)
        .json({ message: "Categoria criada com sucesso!", category });
    } catch (error) {
      next();
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = updateCategorySchema.parse(req.body);
      const category = await CategoryServices.update(id, data);
      res
        .status(200)
        .json({ message: "Categoria atualizada com sucesso!", category });
    } catch (error) {
      next();
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const category = await CategoryServices.delete(id);
      res
        .status(204)
        .json({ message: "Categoria excluida com sucesso!", category });
    } catch (error) {
      next();
    }
  }
}
