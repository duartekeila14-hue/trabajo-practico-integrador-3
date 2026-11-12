import { matchedData } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, role, profile } = matchedData(req);

    // Se guarda el hash, nunca la contraseña real
    const passwordHash = await hashPassword(password);

    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHash,
      role,
      profile,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    // Solo se puede ingresar con un usuario activo
    const user = await UserModel.findOne({ email, deletedAt: null });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValida = await comparePassword(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    // El token se envía en una cookie httpOnly
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {

    return res.status(200).json({
      message: "Perfil obtenido correctamente",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.profile,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile } = matchedData(req);

    const user = req.user;

    // Se modifica solo lo que se envió del perfil embebido
    if (profile.firstName) user.profile.firstName = profile.firstName;
    if (profile.lastName) user.profile.lastName = profile.lastName;
    if (profile.birthDate) user.profile.birthDate = profile.birthDate;
    if (profile.phone) user.profile.phone = profile.phone;

    await user.save();

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
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

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};