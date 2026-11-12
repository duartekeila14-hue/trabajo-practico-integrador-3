import jwt from "jsonwebtoken";

// Genera un token con los datos que le pasemos (payload)
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Verifica el token: si es válido devuelve el payload, si no lanza un error
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};