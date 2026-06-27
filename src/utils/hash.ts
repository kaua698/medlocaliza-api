import bcryptjs from 'bcryptjs';

export const hashPassword = async (senha: string): Promise<string> => {
  return bcryptjs.hash(senha, 10);
};

export const comparePassword = async (senha: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(senha, hash);
};

