"use strict";

import stockService from "../services/stock.service.js";
import stockSchema from "../schema/stock.schema.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

async function registrarEntrada(req, res) {
  try {
    const { error } = stockSchema.entradaStockSchema.validate(req.body);
    if (error) return respondError(res, 400, error.details[0].message);

    const [movimiento, err] = await stockService.registrarEntrada(req.body);
    
    if (err) {
      return respondError( res, 400, "Error registrar aumento de  stock", err);
    }


     return respondSuccess( res, 201, movimiento);

  } catch (error) {
    handleError(error, "registrar entrada stock ");
    return respondInternalError( res);
  }
}

async function registrarSalida(req, res) {
  try {
    const { error } = stockSchema.operacionStockSchema.validate(req.body);
    if (error) return respondError(res, 400, error.details[0].message);

    const [movimiento, err] = await stockService.registrarSalida(req.body);
   
    if (err) {
      return respondError( res, 400, "Error registrar disminucion de stock", err);
    }

   return respondSuccess( res, 201, movimiento);

  } catch (error) {
    handleError(error, "registrar salida stock ");
    return respondInternalError( res);
  }
}

async function registrarEntradaMasiva(req, res) {
  try {
    const { error } = stockSchema.operacionMasivaSchema.validate(req.body);
    if (error) return respondError(res, 400, error.details[0].message);

    const [result, err] = await stockService.registrarEntradaMasiva(req.body);
    if (err) return respondError(res, 400, err.message);

    return respondSuccess(res, 201, "Entrada masiva registrada", result);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}

async function registrarSalidaMasiva(req, res) {
  try {
    const { error } = stockSchema.operacionMasivaSchema.validate(req.body);
    if (error) return respondError(res, 400, error.details[0].message);

    const [result, err] = await stockService.registrarSalidaMasiva(req.body);
    if (err) return respondError(res, 400, err.message);

    return respondSuccess(res, 201, "Salida masiva registrada", result);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}

async function ajustarStockManual(req, res) {
  try {
    const { error } = stockSchema.ajusteStockSchema.validate(req.body);
    if (error) return respondError(res, 400, error.details[0].message);

    const [result, err] = await stockService.ajustarStockManual(req.body);
    if (err) return respondError(res, 400, err.message);

    return respondSuccess(res, 201, "Ajuste manual realizado", result);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}

async function revertirMovimiento(req, res) {
  try {
    const movimientoId = req.params.id;
    const usuario = req.body.usuario;

    if (!usuario) return respondError(res, 400, "ID de usuario requerido");

    const [result, err] = await stockService.revertirMovimiento(movimientoId, usuario);
    if (err) return respondError(res, 400, err.message);

    return respondSuccess(res, 200, "Movimiento revertido correctamente", result);
  } catch (error) {
    return respondError(res, 500, handleError(error).message);
  }
}




export default {
  registrarEntrada,
  registrarSalida,
  registrarEntradaMasiva,
  registrarSalidaMasiva,
  ajustarStockManual,
  revertirMovimiento
};
