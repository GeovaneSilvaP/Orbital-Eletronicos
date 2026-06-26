import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// Utils — função para hash de senha com bcryptjs
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
