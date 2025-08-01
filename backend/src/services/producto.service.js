"use strict";

import Producto from "../models/producto.model.js";
import { handleError } from "../utils/errorHandler.js";
import Movimiento from "../models/movimiento.model.js";

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

   
    if (saved.stock_actual > 0) {
      const movimiento = new Movimiento({
        tipo: "entrada",
        producto: saved._id, 
        cantidad: saved.stock_actual,
        motivo: "Ingreso stock nuevo producto",
        usuario: data.usuario,
        observaciones: "Ingreso stock nuevo producto",
      });

      await movimiento.save();
    }

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
    const usuarioId = data.usuario; 
    delete data.usuario; 

    const productoOriginal = await Producto.findById(id);
    if (!productoOriginal) {
      return [null, new Error("Producto no encontrado")];
    }

    const stockViejo = productoOriginal.stock_actual;
    const stockNuevo = data.stock_actual;

    if (stockNuevo !== undefined && stockNuevo !== stockViejo) {
      const diferencia = stockNuevo - stockViejo;
      const tipoMovimiento = diferencia > 0 ? "entrada" : "salida";

      const movimiento = new Movimiento({
        tipo: tipoMovimiento,
        producto: productoOriginal._id,
        cantidad: Math.abs(diferencia),
        motivo: `Ajuste de stock en actualización de producto`,
        usuario: usuarioId,
        observaciones: `Cambio de stock de ${stockViejo} a ${stockNuevo}`,
      });

      await movimiento.save();
    }

  
    const updated = await Producto.findByIdAndUpdate(id, data, { new: true });
    
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
