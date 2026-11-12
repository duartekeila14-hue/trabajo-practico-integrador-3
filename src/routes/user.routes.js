import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userIdValidation,
  updateUserValidation,
} from "../middlewares/validations/user.validation.js";

export const userRouter = Router();

// Todas las rutas de usuarios son solo para administradores
userRouter.use(authMiddleware, adminMiddleware);

userRouter.get("/", getUsers);
userRouter.get("/:id", userIdValidation, validate, getUserById);
userRouter.put("/:id", updateUserValidation, validate, updateUser);
userRouter.delete("/:id", userIdValidation, validate, deleteUser);