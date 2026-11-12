import { body, param } from "express-validator";
import { UserModel } from "../../models/user.model.js";

export const userIdValidation = [
  param("id").isMongoId().withMessage("El id del usuario no es válido"),
];

// Todos los campos son opcionales: se actualiza solo lo que se envía
export const updateUserValidation = [
  param("id").isMongoId().withMessage("El id del usuario no es válido"),

  body("username")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El nombre de usuario solo puede tener letras y números")
    .custom(async (value, { req }) => {
      const user = await UserModel.findOne({ username: value });
      // Si lo encuentra y es otro usuario distinto al que se edita, está repetido
      if (user && user._id.toString() !== req.params.id) {
        throw new Error("El nombre de usuario ya está en uso");
      }
      return true;
    }),

  body("email")
    .optional()
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .custom(async (value, { req }) => {
      const user = await UserModel.findOne({ email: value });
      if (user && user._id.toString() !== req.params.id) {
        throw new Error("El email ya está registrado");
      }
      return true;
    }),

  body("password")
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número",
    ),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol debe ser user o admin"),

  // Perfil embebido
  body("profile")
    .optional()
    .isObject()
    .withMessage("El perfil debe ser un objeto"),

  body("profile.firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha()
    .withMessage("El nombre solo puede tener letras"),

  body("profile.lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha()
    .withMessage("El apellido solo puede tener letras"),

  body("profile.birthDate")
    .optional()
    .custom((value) => {
      const fecha = new Date(value);

      if (isNaN(fecha)) {
        throw new Error("La fecha de nacimiento no es válida");
      }

      if (fecha > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }

      return true;
    }),

  body("profile.phone")
    .optional()
    .isInt()
    .withMessage("El teléfono solo puede tener números")
    .isLength({ min: 8, max: 15 })
    .withMessage("El teléfono debe tener entre 8 y 15 dígitos"),
];