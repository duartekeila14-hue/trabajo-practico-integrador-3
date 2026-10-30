import { EventModel } from "../models/event.model.js";

// Solo deja pasar a los administradores
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acceso denegado: se requiere rol de administrador",
    });
  }

  next();
};

// Deja pasar al organizador del evento o a un administrador
export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    // El admin pasa directo
    if (req.user.role === "admin") {
      return next();
    }

    const { id } = req.params;

    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Se comparan como texto porque los _id son objetos
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Acceso denegado: solo el organizador o un admin puede hacerlo",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};