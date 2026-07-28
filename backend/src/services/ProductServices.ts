import { ProductRepository } from "../repositories/ProductRepository";
import { CategoryRepositories } from "../repositories/CategoryRepositories";
import { Product } from "../models/product.model";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../validations/products.validation";
import { AppError } from "../errors/AppError";

/**
 * Camada de regras de negócio para gestão do catálogo de produtos.
 */
export class ProductService {
  /**
   * Lista todos os produtos aplicando filtros opcionais de busca.
   */
  static async findAll(filters?: {
    categoryId?: number;
    isActive?: boolean;
  }): Promise<Product[]> {
    return ProductRepository.findAll(filters);
  }

  /**
   * Localiza um produto pelo ID.
   * @throws AppError (404) caso o produto não exista.
   */
  static async findById(id: number): Promise<Product> {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }
    return product;
  }

  /**
   * Processa a criação de um novo produto.
   * Valida se a categoria informada existe e se o SKU é único no sistema.
   */
  static async create(data: CreateProductInput): Promise<Product> {
    await this.ensureCategoryExists(data.categoryId);
    await this.ensureSkuIsUnique(data.sku);

    return ProductRepository.create(data);
  }

  /**
   * Processa a atualização de um produto existente.
   */
  static async update(id: number, data: UpdateProductInput): Promise<Product> {
    await this.findById(id); // Garante a existência do produto (dispara 404 se não achar)

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

  /**
   * Deleta um produto após validar sua existência no banco.
   */
  static async delete(id: number): Promise<void> {
    await this.findById(id);
    await ProductRepository.delete(id);
  }

  /**
   * Validação auxiliar: Garante que a chave estrangeira da categoria aponta para um registro existente.
   * @throws AppError (400) se a categoria não for encontrada.
   */
  static async ensureCategoryExists(categoryId: number): Promise<void> {
    const category = await CategoryRepositories.findById(categoryId);
    if (!category) {
      throw new AppError("Categoria informada não existe", 400);
    }
  }

  /**
   * Validação auxiliar: Garante que não existam dois produtos com o mesmo SKU (identificador de estoque).
   * @param ignoreId ID do produto atual no caso de edições (evita acusar conflito com ele mesmo).
   * @throws AppError (409) em caso de duplicidade de SKU.
   */
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
