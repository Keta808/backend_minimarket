"use strict";

import Categoria from "../models/categoria.model.js";
import { handleError } from "../utils/errorHandler.js";
import Producto from "../models/producto.model.js";

async function createCategoria(data) {
  try {
    const categoria = new Categoria(data);
    const saved = await categoria.save();
    return [saved, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getAllCategorias() {
  try {
    const categorias = await Categoria.find();
    return [categorias, null];

  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getCategoriasConDetalleProductos() {
  try {
    const categorias = await Categoria.find();

    const resultado = await Promise.all(
      categorias.map(async (categoria) => {
        const productos = await Producto.find({ categoria: categoria._id }, "nombre_base presentacion");
        const listaProductos = productos.map(
          (p) => `${p.nombre_base} ${p.presentacion}`.trim()
        );
        return {
          categoria: categoria.nombre,  
          _id:categoria._id,
          cantidadProductos: productos.length,
          productos: listaProductos,
        };
      })
    );

    return [resultado, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getCategoriaById(id) {
  try {
    const categoria = await Categoria.findById(id);
    return [categoria, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function updateCategoria(id, data) {
  try {
    const updated = await Categoria.findByIdAndUpdate(id, data, { new: true });
    return [updated, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function deleteCategoria(id) {
  try {
    const deleted = await Categoria.findByIdAndDelete(id);
    return [deleted, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

export default {
  createCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
  getCategoriasConDetalleProductos
};
