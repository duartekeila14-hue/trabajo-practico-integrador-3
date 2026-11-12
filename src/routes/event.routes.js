import { Router } from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/events.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdminMiddleware } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  eventIdValidation,
  createEventValidation,
  updateEventValidation,
} from "../middlewares/validations/event.validation.js";

export const eventRouter = Router();

// Todas las rutas de eventos requieren estar autenticado
eventRouter.use(authMiddleware);

eventRouter.post("/", createEventValidation, validate, createEvent);
eventRouter.get("/", getEvents);

// "/my" tiene que ir antes de "/:id", si no Express lo tomaría como un id
eventRouter.get("/my", getMyEvents);

eventRouter.get("/:id", eventIdValidation, validate, getEventById);

// Solo el organizador o un admin puede editar o eliminar
eventRouter.put(
  "/:id",
  eventIdValidation,
  validate,
  ownerOrAdminMiddleware,
  updateEventValidation,
  validate,
  updateEvent,
);
eventRouter.delete(
  "/:id",
  eventIdValidation,
  validate,
  ownerOrAdminMiddleware,
  deleteEvent,
);