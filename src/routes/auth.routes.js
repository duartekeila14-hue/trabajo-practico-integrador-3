import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
} from "../middlewares/validations/auth.validation.js";

export const authRouter = Router();

// Rutas públicas
authRouter.post("/register", registerValidation, validate, register);
authRouter.post("/login", loginValidation, validate, login);

// Rutas para usuarios autenticados
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.put(
  "/profile",
  authMiddleware,
  updateProfileValidation,
  validate,
  updateProfile,
);
authRouter.post("/logout", authMiddleware, logout);