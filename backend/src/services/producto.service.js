"use strict";

import Producto from "../models/producto.model.js";
import { handleError } from "../utils/errorHandler.js";


// Crear productos
async function createProducto(data) {
  try {

    const existe = await Producto.findOne({
      nombre_base: data.nombre_base,
      presentacion: data.presentacion,
    });
    
    if (existe) {
      return [null, new Error("Ya existe un producto con el mismo nombre y presentación")];
    }

    const producto = new Producto(data);
    const saved = await producto.save();
    return [saved, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getAllProductos() {
  try {
    const productos = await Producto.find().populate('categoria');
  
    return [productos, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getProductoById(id) {
  try {
    const producto = await Producto.findById(id);
    return [producto, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function updateProducto(id, data) {
  try {
    const updated = await Producto.findByIdAndUpdate(id, data, {
      new: true,
    });
    return [updated, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function deleteProducto(id) {
  try {
    const deleted = await Producto.findByIdAndDelete(id);
    return [deleted, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

export default {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
};
