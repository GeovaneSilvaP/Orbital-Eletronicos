import { ProductRepository } from "../repositories/ProductRepository";
import { CategoryRepositories } from "../repositories/CategoryRepositories";
import { Product } from "../models/product.model";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../validations/products.validation";
import { AppError } from "../errors/AppError";

export class ProductService {
  static async findAll(filters?: {
    categoryId?: number;
    isActive?: boolean;
  }): Promise<Product[]> {
    return ProductRepository.findAll(filters);
  }

  static async findById(id: number): Promise<Product> {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }
    return product;
  }

  static async create(data: CreateProductInput): Promise<Product> {
    await this.ensureCategoryExists(data.categoryId);
    await this.ensureSkuIsUnique(data.sku);

    return ProductRepository.create(data);
  }

  static async update(id: number, data: UpdateProductInput): Promise<Product> {
    await this.findById(id); // garante que existe (lança 404 se não)

    if (data.categoryId !== undefined) {
      await this.ensureCategoryExists(data.categoryId);
    }

    if (data.sku) {
      await this.ensureSkuIsUnique(data.sku, id);
    }

    const updated = await ProductRepository.update(id, data);
    if (!updated) {
      throw new AppError("Produto não encontrado", 404);
    }
    return updated;
  }

  static async delete(id: number): Promise<void> {
    await this.findById(id);
    await ProductRepository.delete(id);
  }

  static async ensureCategoryExists(categoryId: number): Promise<void> {
    const category = await CategoryRepositories.findById(categoryId);
    if (!category) {
      throw new AppError("Categoria informada não existe", 400);
    }
  }

  static async ensureSkuIsUnique(
    sku: string,
    ignoreId?: number,
  ): Promise<void> {
    const existing = await ProductRepository.findBySku(sku);
    if (existing && existing.id !== ignoreId) {
      throw new AppError("SKU já cadastrado", 409);
    }
  }
}
