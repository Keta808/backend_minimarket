"use strict";

import movimientoService from "../services/movimiento.service.js";
import movimientoSchema from "../schema/movimiento.schema.js";
import { respondSuccess, respondError,respondInternalError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

async function createMovimiento(req, res) {
  try {
    const { error } = movimientoSchema.movimientoBodySchema.validate(req.body);
    if (error) return respondError( res, 400, "Datos invalidos" ,error.details[0].message);

    const [movimiento, err] = await movimientoService.createMovimiento(req.body);
    if (err) return respondError( res, 500,"Error al crear el movimiento", err.message);

    return respondSuccess( res, 201, movimiento);
  } catch (error) {
    handleError(error, "createMovimiento");
    return respondInternalError( res);
  }
}

async function getAllMovimiento(req, res) {
  try {
   
    const [movimientos, err] = await movimientoService.getAllMovimiento();
 
    if (err) return respondError(res, 500,"error al obtener todos los movimientos", err.message);

    return respondSuccess( res, 200, movimientos);
  } catch (error) {
    return respondError(res, 500,"Error catch en obtener todos los movimientos", handleError(error).message);
  }
}

async function getMovimientobyId(req, res) {
  try {
    const { error } = movimientoSchema.movimientoIdSchema.validate(req.params);
    if (error) return respondError( res, 400, "Error al validar formato -> ",error.details[0].message);

    const [movimiento, err] = await movimientoService.getMovimientobyId(req.params.id);
    if (err) return respondError(res, 500,"Error al obtener los movimientos por ID" ,err.message);
    if (!movimiento) return respondError( res, 404, "Movimiento no encontrado", "ERROR");

    return respondSuccess( res, 200,movimiento);
  } catch (error) {
    return respondError( res, 500, "Error catch en obtener los movimientos por ID", handleError(error).message);
  }
}

async function updateMovimiento(req, res) {
  try {
    const { error: idError } = movimientoSchema.movimientoIdSchema.validate(req.params);
    if (idError) return respondError(res, 400,"Error en validar el ID movimiento update", idError.details[0].message);

    const { error: bodyError } = movimientoSchema.movimientoBodySchema.validate(req.body);
    if (bodyError) return respondError( res, 400, "Error en validar el movimiento update",bodyError.details[0].message);

    const [updated, err] = await movimientoService.updateMovimiento(req.params.id, req.body);
    if (err) return respondError(res, 500, "error al actualizar el movimiento",err.message);
    if (!updated) return respondError( res, 404, "Movimiento no encontrado","");

    return respondSuccess( res, 200, updated);
  } catch (error) {
    return respondError( res, 500, "Error en catch de updateMovimiento ->",handleError(error).message);
  }
}

async function deleteMovimiento(req, res) {
  try {
    const { error } = movimientoSchema.movimientoIdSchema.validate(req.params);
    if (error) return respondError( res, 400, "Error al validar id en deleteMovimiento",error.details[0].message);

    const [deleted, err] = await movimientoService.deleteMovimiento(req.params.id);
    if (err) return respondError(res, 500, "Error al eliminar el movimiento ",err.message);
    if (!deleted) return respondError( res, 404, "Movimiento no encontrado","");

    return respondSuccess( res, 200, deleted);
  } catch (error) {
    return respondError(res, 500, "Error en catch de deleteMovimientos ",handleError(error).message);
  }
}

async function getMovimientosFiltrados(req, res) {
  try {
    const [movimientos, err] = await movimientoService.getMovimientosFiltrados(req.query);
    if (err) return respondError( res, 400, "error al filtrar los movimientos",err.message);
    return respondSuccess( res, 200,  movimientos);
  } catch (error) {
    return respondError(res, 500, "Error en catch de movimientosFiltrados",handleError(error).message);
  }
}

async function getUltimosMovimientos(req, res) {
  try {


    const [movimientos, err] = await movimientoService.getUltimosMovimientos();
    if (err) return respondError(res, 500, "Error al obtener los últimos movimientos", err.message);

    return respondSuccess(res, 200, movimientos);
  } catch (error) {
    return respondError(res, 500, "Error en catch de getUltimosMovimientos", handleError(error).message);
  }
}

export default {
  createMovimiento,
  getAllMovimiento,
  getMovimientobyId,
  updateMovimiento,
  deleteMovimiento,
  getMovimientosFiltrados,
  getUltimosMovimientos,
  
};
