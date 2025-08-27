import bcrypt from "bcrypt";

export const passwordVerify = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};
