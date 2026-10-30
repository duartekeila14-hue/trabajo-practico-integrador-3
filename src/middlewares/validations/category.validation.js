import { body, param } from "express-validator";
import { CategoryModel } from "../../models/category.model.js";

export const categoryIdValidation = [
  param("id").isMongoId().withMessage("El id de la categoría no es válido"),
];

export const createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .custom(async (value) => {
      const category = await CategoryModel.findOne({ name: value });
      if (category) {
        throw new Error("Ya existe una categoría con ese nombre");
      }
      return true;
    }),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];

export const updateCategoryValidation = [
  param("id").isMongoId().withMessage("El id de la categoría no es válido"),

  body("name")
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .custom(async (value, { req }) => {
      const category = await CategoryModel.findOne({ name: value });
      // Si existe y es otra categoría distinta a la que se edita, está repetido
      if (category && category._id.toString() !== req.params.id) {
        throw new Error("Ya existe una categoría con ese nombre");
      }
      return true;
    }),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];