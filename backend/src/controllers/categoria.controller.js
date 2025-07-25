"use strict";

import categoriaService from "../services/categoria.service.js";
import categoriaSchema from "../schema/categoria.schema.js";
import { respondSuccess, respondError,respondInternalError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

async function createCategoria(req, res) {
  try {
    const { value, error } = categoriaSchema.categoriaBodySchema.validate(req.body);
    if (error) {
      return respondError(res, 400, "Datos inválidos", error.details);
    }
    const [categoria, err] = await categoriaService.createCategoria(value);
    if (err) {
      return respondError( res, 400, "Error al crear la categoría, ya existe una con el mismo nombre", err);
    }

    respondSuccess( res, 201, categoria);
  } catch (error) {
    handleError(error, "createCategoria");
    return respondInternalError( res);
  }
}

async function getAllCategorias(req, res) {
  try {
    const [categorias, err] = await categoriaService.getAllCategorias();
    if (err) return respondError(res, 500, err.message);

    return respondSuccess(res, 200, categorias);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}


async function getCategoriasConDetalleProductos (req, res){
try {
  const [categorias ,err] = await categoriaService.getCategoriasConDetalleProductos();
  if(err) return respondError(res,500,err.message);

  return respondSuccess(res,200,categorias);

} catch (error) {
  return respondError(res, 500, handleError(error).message);
}

}
async function getCategoriaById(req, res) {
  try {
    const { error } = categoriaSchema.categoriaIdSchema.validate(req.params);
    if (error) return respondError(res, 400, error.details[0].message);

    const [categoria, err] = await categoriaService.getCategoriaById(req.params.id);
    if (err) return respondError(res, 500, err.message);
    if (!categoria) return respondError(res, 404, "Categoría no encontrada");

    return respondSuccess(res, 200, "Categoría obtenida", categoria);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}

async function updateCategoria(req, res) {
  try {
    const { error: idError } = categoriaSchema.categoriaIdSchema.validate(req.params);
    if (idError) return respondError(res, 400, idError.details[0].message);

    const { error: bodyError } = categoriaSchema.categoriaBodySchema.validate(req.body);
    if (bodyError) return respondError(res, 400, bodyError.details[0].message);

    const [updated, err] = await categoriaService.updateCategoria(req.params.id, req.body);
    if (err) return respondError(res, 500, err.message);
    if (!updated) return respondError(res, 404, "Categoría no encontrada");

    return respondSuccess(res, 200, "Categoría actualizada", updated);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}

async function deleteCategoria(req, res) {
  try {
    const { error } = categoriaSchema.categoriaIdSchema.validate(req.params);
    if (error) return respondError(res, 400, error.details[0].message);

    const [deleted, err] = await categoriaService.deleteCategoria(req.params.id);
    if (err) return respondError(res, 500, err.message);
    if (!deleted) return respondError(res, 404, "Categoría no encontrada");

    return respondSuccess(res, 200, "Categoría eliminada", deleted);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}

export default {
  createCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
  getCategoriasConDetalleProductos,
};

