import { verifyToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Lee el token de la cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No autenticado: falta el token" });
    }

    // Verificar el token (si es inválido o venció, lanza un error)
    const decoded = verifyToken(token);

    // Buscar al usuario activo (no eliminado)
    const user = await UserModel.findOne({
      _id: decoded.id,
      deletedAt: null,
    });

    if (!user) {
      return res.status(401).json({ message: "No autenticado: usuario no válido" });
    }

    // Dejar el usuario disponible para los pasos siguientes
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "No autenticado: token inválido o vencido" });
  }
};