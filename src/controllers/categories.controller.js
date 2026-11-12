import { matchedData } from "express-validator";
import { CategoryModel } from "../models/category.model.js";
import { EventModel } from "../models/event.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = matchedData(req);

    const newCategory = await CategoryModel.create({ name, description });

    return res.status(201).json({
      message: "Categoría creada correctamente",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json({
      message: "Categorías obtenidas correctamente",
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const category = await CategoryModel.findById(id).populate("events");

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json({
      message: "Categoría obtenida correctamente",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id, name, description } = matchedData(req);

    // Verificar que la categoría exista antes de editarla
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    return res.status(200).json({
      message: "Categoría actualizada correctamente",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Verificar que la categoría exista antes de eliminarla
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Eliminación en cascada: quitar la categoría de todos los eventos
    await EventModel.updateMany(
      { categories: id },
      { $pull: { categories: id } },
    );

    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};