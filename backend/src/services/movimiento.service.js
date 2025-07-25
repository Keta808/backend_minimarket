"use strict";

import Movimiento from "../models/movimiento.model.js";
import { handleError } from "../utils/errorHandler.js";

async function createMovimiento(data) {
  try {
    const movimiento = new Movimiento(data);
    const saved = await movimiento.save();
    return [saved, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getAllMovimiento() {
  try {
    const movimientos = await Movimiento.find() .sort({ createdAt: -1 }) 
      .populate({
        path : "producto",
        select: "nombre_base presentacion",
      })
      .populate({
        path: "usuario",
        select: "username", 
      });
    return [movimientos, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getMovimientobyId(id) {
  try {
    const movimiento = await Movimiento.findById(id).populate("producto").populate("user");
    return [movimiento, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function updateMovimiento(id, data) {
  try {
    const updated = await Movimiento.findByIdAndUpdate(id, data, { new: true });
    return [updated, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function deleteMovimiento(id) {
  try {
    const deleted = await Movimiento.findByIdAndDelete(id);
    return [deleted, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getMovimientosFiltrados(query) {
  try {
    const filtro = {};

    if (query.producto) filtro.producto = query.producto;
    if (query.tipo) filtro.tipo = query.tipo;
    if (query.usuario) filtro.usuario = query.usuario;

    if (query.desde || query.hasta) {
      filtro.createdAt = {};
      if (query.desde) filtro.createdAt.$gte = new Date(query.desde);
      if (query.hasta) filtro.createdAt.$lte = new Date(query.hasta);
    }
    const movimientos = await Movimiento.find(filtro)
      .populate("producto", "nombre_base")
      .populate("usuario", "nombre email") 
      .sort({ createdAt: -1 });

    return [movimientos, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function getUltimosMovimientos() {
  try {
    const movimientos = await Movimiento.find()
      .sort({ createdAt: -1 }) 
      .limit(5)
      .populate({
        path: "producto",
        select: "nombre_base presentacion",
      })
      .populate({
        path: "usuario",
        select: "username",
      });
    return [movimientos, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

export default {
  createMovimiento,
  getAllMovimiento,
  getMovimientobyId,
  updateMovimiento,
  deleteMovimiento,
  getMovimientosFiltrados,
  getUltimosMovimientos
};
