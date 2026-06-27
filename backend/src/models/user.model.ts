export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export type CreateUserDTO = Omit<
  User,
  "id" | "created_at" | "updated_at" | "role"
> & { role?: UserRole };

export type UpdateUserDTO = Partial<
  Omit<User, "id" | "created_at" | "updated_at">
>;

// Sem o campo "password" — usado em respostas para o client
export type UserPublic = Omit<User, "password">;