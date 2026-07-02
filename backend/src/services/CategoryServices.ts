import { CategoryRepositories } from "../repositories/CategoryRepositories";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validations/category.validation";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../models/category.model";
import { AppError } from "../errors/AppError";

/**
 * Utilitário puro que transforma strings em texto compatível com URLs amigáveis.
 * Exemplo: "Placas de Vídeo!" -> "placas-de-video"
 */
const slugify = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Limpa acentuações gráficos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-"); // Substitui espaços por hifens
};

/**
 * Regras de negócio e validações para o ecossistema de categorias.
 */
export class CategoryServices {
  static async getAll() {
    const categories = await CategoryRepositories.findAll();
    return categories;
  }

  /**
   * Localiza uma categoria validando sua existência.
   * @throws AppError (404) se não existir.
   */
  static async getById(id: number) {
    const category = await CategoryRepositories.findById(id);
    if (!category) {
      throw new AppError("Categoria não encontrada", 404);
    }
    return category;
  }

  /**
   * Cria uma categoria gerando automaticamente seu slug único.
   * @throws AppError (409) se o nome já estiver em uso.
   */
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

  /**
   * Modifica informações de uma categoria existente, recalculando o slug caso o nome mude.
   * @throws AppError (404) se a categoria não existir.
   * @throws AppError (409) se o novo nome colidir com outra categoria.
   */
  static async update(id: number, data: UpdateCategoryInput) {
    await CategoryRepositories.findById(id);

    if (data.name) {
      const existing = await CategoryRepositories.findByName(data.name);
      // Impede renomear caso o nome pertença a outra categoria existente
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

  /**
   * Remove uma categoria do sistema.
   * @throws AppError (404) se a categoria não existir.
   */
  static async delete(id: number) {
    await CategoryRepositories.findById(id);
    const category = await CategoryRepositories.delete(id);
    return category;
  }
}
