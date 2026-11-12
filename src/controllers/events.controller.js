import { matchedData } from "express-validator";
import { EventModel } from "../models/event.model.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      capacity,
      price,
      status,
      location,
      categories,
    } = matchedData(req);

    const newEvent = await EventModel.create({
      title,
      description,
      startDate,
      endDate,
      capacity,
      price,
      status,
      location,
      categories,
      // El organizador es el usuario autenticado
      organizer: req.user._id,
    });

    return res.status(201).json({
      message: "Evento creado correctamente",
      event: newEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("organizer", "username email")
      .populate("categories");

    return res.status(200).json({
      message: "Eventos obtenidos correctamente",
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ organizer: req.user._id })
      .populate("organizer", "username email")
      .populate("categories");

    return res.status(200).json({
      message: "Tus eventos fueron obtenidos correctamente",
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const event = await EventModel.findById(id)
      .populate("organizer", "username email")
      .populate("categories");

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    return res.status(200).json({
      message: "Evento obtenido correctamente",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      startDate,
      endDate,
      capacity,
      price,
      status,
      location,
      categories,
    } = matchedData(req);

    // Verificar que el evento exista antes de editarlo
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Se modifica solo lo que se envió
    if (title) event.title = title;
    if (description) event.description = description;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (capacity !== undefined) event.capacity = capacity;
    if (price !== undefined) event.price = price;
    if (status) event.status = status;
    if (categories) event.categories = categories;

    if (location) {
      if (location.venue) event.location.venue = location.venue;
      if (location.address) event.location.address = location.address;
      if (location.city) event.location.city = location.city;
    }

    await event.save();

    return res.status(200).json({
      message: "Evento actualizado correctamente",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Verificar que el evento exista antes de eliminarlo
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Eliminación física
    await EventModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};