import { body, param } from "express-validator";
import { EventModel } from "../../models/event.model.js";
import { CategoryModel } from "../../models/category.model.js";

export const eventIdValidation = [
  param("id").isMongoId().withMessage("El id del evento no es válido"),
];

export const createEventValidation = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .custom(async (value) => {
      const event = await EventModel.findOne({ title: value });
      if (event) {
        throw new Error("Ya existe un evento con ese título");
      }
      return true;
    }),

  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .custom((value) => {
      if (isNaN(new Date(value))) {
        throw new Error("La fecha de inicio no es válida");
      }
      return true;
    }),

  body("endDate")
    .notEmpty()
    .withMessage("La fecha de fin es obligatoria")
    .custom((value, { req }) => {
      if (isNaN(new Date(value))) {
        throw new Error("La fecha de fin no es válida");
      }
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("La fecha de fin debe ser posterior a la de inicio");
      }
      return true;
    }),

  body("capacity")
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado debe ser scheduled, cancelled o finished"),

  // Ubicación embebida
  body("location")
    .notEmpty()
    .withMessage("La ubicación es obligatoria")
    .isObject()
    .withMessage("La ubicación debe ser un objeto"),

  body("location.venue")
    .notEmpty()
    .withMessage("El lugar es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  // Categorías (opcional)
  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben enviarse en un array"),

  body("categories.*")
    .isMongoId()
    .withMessage("El id de una categoría no es válido")
    .bail()
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error("Una de las categorías enviadas no existe");
      }
      return true;
    }),
];

// Todos los campos son opcionales: se actualiza solo lo que se envía
export const updateEventValidation = [
  param("id").isMongoId().withMessage("El id del evento no es válido"),

  body("title")
    .optional()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .custom(async (value, { req }) => {
      const event = await EventModel.findOne({ title: value });
      // Si existe y es otro evento distinto al que se edita, está repetido
      if (event && event._id.toString() !== req.params.id) {
        throw new Error("Ya existe un evento con ese título");
      }
      return true;
    }),

  body("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("startDate")
    .optional()
    .custom((value) => {
      if (isNaN(new Date(value))) {
        throw new Error("La fecha de inicio no es válida");
      }
      return true;
    }),

  body("endDate")
    .optional()
    .custom((value, { req }) => {
      if (isNaN(new Date(value))) {
        throw new Error("La fecha de fin no es válida");
      }
      // Solo se compara si también se envió la fecha de inicio
      if (
        req.body.startDate &&
        new Date(value) <= new Date(req.body.startDate)
      ) {
        throw new Error("La fecha de fin debe ser posterior a la de inicio");
      }
      return true;
    }),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado debe ser scheduled, cancelled o finished"),

  // Ubicación embebida
  body("location")
    .optional()
    .isObject()
    .withMessage("La ubicación debe ser un objeto"),

  body("location.venue")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .optional()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  // Categorías (opcional)
  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben enviarse en un array"),

  body("categories.*")
    .isMongoId()
    .withMessage("El id de una categoría no es válido")
    .bail()
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error("Una de las categorías enviadas no existe");
      }
      return true;
    }),
];