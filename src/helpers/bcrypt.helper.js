import bcrypt from "bcrypt";

// Recibe la contraseña en texto plano y devuelve el hash
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compara la contraseña escrita con el hash guardado
// Devuelve true si coinciden o false si no
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};