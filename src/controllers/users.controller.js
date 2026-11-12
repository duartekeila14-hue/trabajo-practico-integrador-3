import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { EventModel } from "../models/event.model.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

export const getUsers = async (req, res) => {
  try {
    // Solo usuarios activos, con sus eventos (virtual populate)
    const users = await UserModel.find({ deletedAt: null })
      .select("-password")
      .populate("events");

    return res.status(200).json({
      message: "Usuarios obtenidos correctamente",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const user = await UserModel.findOne({ _id: id, deletedAt: null })
      .select("-password")
      .populate("events");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Usuario obtenido correctamente",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, username, email, password, role, profile } = matchedData(req);

    // Verificar que el usuario exista (y esté activo) antes de editarlo
    const user = await UserModel.findOne({ _id: id, deletedAt: null });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await hashPassword(password);

    if (profile) {
      if (profile.firstName) user.profile.firstName = profile.firstName;
      if (profile.lastName) user.profile.lastName = profile.lastName;
      if (profile.birthDate) user.profile.birthDate = profile.birthDate;
      if (profile.phone) user.profile.phone = profile.phone;
    }

    await user.save();

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Verificar que el usuario exista (y esté activo) antes de eliminarlo
    const user = await UserModel.findOne({ _id: id, deletedAt: null });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminación en cascada: se borran los eventos que organizó
    await EventModel.deleteMany({ organizer: id });

    // Eliminación lógica: se guarda la fecha en deletedAt
    user.deletedAt = new Date();
    await user.save();

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};