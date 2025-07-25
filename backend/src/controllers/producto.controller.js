"use strict";

import productoService from "../services/producto.service.js";
import productoSchema from "../schema/producto.schema.js";
import { respondSuccess, respondError, respondInternalError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";


// Creacion de producto (Arreglada)
async function createProducto(req, res) {
  try {
    const { value, error } = productoSchema.productoBodySchema.validate(req.body);

    if (error) {
      return respondError( res, 400, "Datos inválidos", error.details);
    }

    const [producto, err] = await productoService.createProducto(value);
 
    if (err) {
      return respondError( res, 400, err ,"Error al crear el producto, ya existe uno con los mismos datos" );
    }

    return respondSuccess( res, 201, producto);
  } catch (error) {
    handleError(error, "createProducto");
    return respondInternalError(res,404,"error create producto");
  }
}

// Obtener todos los productos (Arreglada)
async function getAllProductos(req, res) {
  try {
    const [productos, err] = await productoService.getAllProductos();
    if (err) return respondError(res, 500, err.message);

    if (err){
      return respondError(res,500, "Error al obtener todos los productos",err);
    }

    return respondSuccess( res, 200, productos);

  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}

// Obtener producto por ID (Arreglado)
async function getProductoById(req, res) {
  try {
    const { error } = productoSchema.productoIdSchema.validate(req.params);
    if (error) return respondError(res, 400, "error en  validar id de producto",error.details[0].message);

    const [producto, err] = await productoService.getProductoById(req.params.id);

    if (err) return respondError( res, 500, "Error al obtener el producto",err.message);

    if (!producto) return respondError( res, 404, "Producto no encontrado","");

    return respondSuccess(res, 200, producto);
  } catch (error) {
    return respondError( res, 500, handleError(error).message);
  }
}


//Actualizar producto ( NO CHECKEADA )
async function updateProducto(req, res) {
  try {
    const { error: idError } = productoSchema.productoIdSchema.validate(req.params);
    if (idError) return respondError(res, 400,"Error en validar id de producto" ,idError.details[0].message);

    const { error: bodyError } = productoSchema.productoBodySchema.validate(req.body);
    if (bodyError) return respondError( res, 400, "error en validar schema de updateproducto",bodyError.details[0].message);

    const [updated, err] = await productoService.updateProducto(req.params.id, req.body);
    if (err) return respondError(res, 500,"error en actualizar producto" ,err.message);
    if (!updated) return respondError(res, 404, "Producto no encontrado");

    return respondSuccess( res, 200, updated);
  } catch (error) {
    return respondError(res, 500, "error en catch de updateProducto",handleError(error).message);
  }
}

// Borrar producto (NO CHECKEADA)
async function deleteProducto(req, res) {
  try {
    const { error } = productoSchema.productoIdSchema.validate(req.params);
    if (error) return respondError(res, 400, error.details[0].message);

    const [deleted, err] = await productoService.deleteProducto(req.params.id);
    if (err) return respondError(res, 500, err.message);
    if (!deleted) return respondError(res, 404, "Producto no encontrado");

    return respondSuccess(res, 200, "Producto eliminado", deleted);
  } catch (error) {
    return respondError( res, 500, handleError(error).message);
  }
}

export default {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
};
