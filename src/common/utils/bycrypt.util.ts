import * as Bcrypt from 'bcrypt';
export const createPassword = async (str: string) => {
  return await Bcrypt.hash(str, 11);
};
export const verifyPassword = async (str: string, hash: string) => {
  return await Bcrypt.compare(str, hash);
};
