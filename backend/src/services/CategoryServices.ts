import { CategoryRepositories } from "../repositories/CategoryRepositories";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validations/category.validation";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../models/category.model";
import { AppError } from "../errors/AppError";

const slugify = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

export class CategoryServices {
  static async getAll() {
    const categories = await CategoryRepositories.findAll();
    return categories;
  }

  static async getById(id: number) {
    const category = await CategoryRepositories.findById(id);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }
    return category;
  }

  static async create(data: CreateCategoryInput) {
    const existing = await CategoryRepositories.findByName(data.name);
    if (existing) {
      throw new AppError("Já existe uma categoria com esse nome", 409);
    }

    const slug = slugify(data.name);
    const id = await CategoryRepositories.create({
      name: data.name,
      slug: slug,
      description: data.description ?? null,
    });

    return await CategoryRepositories.findById(id);
  }

  static async update(id: number, data: UpdateCategoryInput) {
    await CategoryRepositories.findById(id);

    if (data.name) {
      const existing = await CategoryRepositories.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new AppError("Já existe uma categoria com esse nome", 404);
      }
    }

    const fields: UpdateCategoryDTO = {};

    if (data.name) {
      fields.name = data.name;
      fields.slug = slugify(data.name);
    }

    if (data.description !== undefined) {
      fields.description = data.description ?? null;
    }

    return await CategoryRepositories.update(id, fields);
  }

  static async delete(id: number) {
    await CategoryRepositories.findById(id);
    const category = await CategoryRepositories.delete(id);
    return category;
  }
}
