export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateCategoryDTO = Omit<Category,"id" | "created_at" | "updated_at">;
export type UpdateCategoryDTO =Partial< Omit<Category,"id" | "created_at" | "updated_at">>;