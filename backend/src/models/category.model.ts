/**
 * Representação fiel da tabela 'categories' do banco MySQL.
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Contrato de dados requerido para inserção de novas categorias.
 */
export type CreateCategoryDTO = Omit<
  Category,
  "id" | "created_at" | "updated_at"
>;

/**
 * Contrato de dados aceito para atualizações parciais.
 */
export type UpdateCategoryDTO = Partial<
  Omit<Category, "id" | "created_at" | "updated_at">
>;
