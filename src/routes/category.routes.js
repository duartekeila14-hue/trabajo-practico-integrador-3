import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  categoryIdValidation,
  createCategoryValidation,
  updateCategoryValidation,
} from "../middlewares/validations/category.validation.js";

export const categoryRouter = Router();

// Todas las rutas de categorías requieren estar autenticado
categoryRouter.use(authMiddleware);

// Solo administradores
categoryRouter.post(
  "/",
  adminMiddleware,
  createCategoryValidation,
  validate,
  createCategory,
);
categoryRouter.put(
  "/:id",
  adminMiddleware,
  updateCategoryValidation,
  validate,
  updateCategory,
);
categoryRouter.delete(
  "/:id",
  adminMiddleware,
  categoryIdValidation,
  validate,
  deleteCategory,
);

// Cualquier usuario autenticado
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", categoryIdValidation, validate, getCategoryById);