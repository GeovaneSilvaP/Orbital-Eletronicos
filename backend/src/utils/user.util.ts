import { User, UserPublic } from "../models/user.model";

// Utils — função para remover password antes de devolver pro client (gerar UserPublic) e hash de senha com bcryptjs
export const toUserPublic = (user: User): UserPublic => {
  const { password, ...UserPublic } = user;
  return UserPublic;
};
