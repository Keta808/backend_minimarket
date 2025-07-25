"use strict";

import Producto from "../models/producto.model.js";
import Movimiento from "../models/movimiento.model.js";
import { handleError } from "../utils/errorHandler.js";

async function registrarEntrada({ producto, cantidad, motivo, usuario, observaciones }) {
  try {
    const prod = await Producto.findById(producto);
    if (!prod) return [null, new Error("Producto no encontrado")];

    prod.stock_actual += cantidad;
    await prod.save();

    const movimiento = new Movimiento({
      tipo: "entrada",
      producto,
      cantidad,
      motivo,
      usuario,
      observaciones,
    });

    const saved = await movimiento.save();
    return [saved, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function registrarSalida({ producto, cantidad, motivo, usuario, observaciones }) {
  try {
    const prod = await Producto.findById(producto);
    if (!prod) return [null, new Error("Producto no encontrado")];

    if (prod.stock_actual < cantidad) {
      return [null, new Error("Stock insuficiente para realizar la salida")];
    }

    prod.stock_actual -= cantidad;
    await prod.save();

    const movimiento = new Movimiento({
      tipo: "salida",
      producto,
      cantidad,
      motivo,
      usuario,
      observaciones,
    });

    const saved = await movimiento.save();
    return [saved, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function registrarEntradaMasiva({ usuario, operaciones }) {
  try {
    const movimientos = [];

    for (const op of operaciones) {
      const prod = await Producto.findById(op.producto);
      if (!prod) return [null, new Error(`Producto no encontrado: ${op.producto}`)];

      prod.stock_actual += op.cantidad;
      await prod.save();

      const movimiento = new Movimiento({
        tipo: "entrada",
        producto: op.producto,
        cantidad: op.cantidad,
        motivo: op.motivo,
        usuario,
        observaciones: op.observaciones,
      });

      const saved = await movimiento.save();
      movimientos.push(saved);
    }
    return [movimientos, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function registrarSalidaMasiva({ usuario, operaciones }) {
  try {
    const movimientos = [];

    for (const op of operaciones) {
      const prod = await Producto.findById(op.producto);
      if (!prod) return [null, new Error(`Producto no encontrado: ${op.producto}`)];
      if (prod.stock_actual < op.cantidad)
        return [null, new Error(`Stock insuficiente para producto ${op.producto}`)];

      prod.stock_actual -= op.cantidad;
      await prod.save();

      const movimiento = new Movimiento({
        tipo: "salida",
        producto: op.producto,
        cantidad: op.cantidad,
        motivo: op.motivo,
        usuario,
        observaciones: op.observaciones,
      });

      const saved = await movimiento.save();
      movimientos.push(saved);
    }

    return [movimientos, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function ajustarStockManual({ producto, nuevo_stock, motivo, usuario, observaciones }) {
  try {
    const prod = await Producto.findById(producto);
    if (!prod) return [null, new Error("Producto no encontrado")];
    const diferencia = nuevo_stock - prod.stock_actual;
    if (diferencia === 0) {
      return [null, new Error("El stock actual ya coincide con el valor ingresado")];
    }

    prod.stock_actual = nuevo_stock;
    await prod.save();

    const movimiento = new Movimiento({
      tipo: "ajuste",
      producto,
      cantidad: Math.abs(diferencia),
      motivo,
      usuario,
      observaciones,
    });

    const saved = await movimiento.save();
    return [saved, null];
  } catch (error) {
    return [null, handleError(error)];
  }
}

async function revertirMovimiento(id, usuario) {
  try {
    const mov = await Movimiento.findById(id);
    if (!mov) return [null, new Error("Movimiento no encontrado")];
    if (mov.revertido) return [null, new Error("El movimiento ya fue revertido")];

    const prod = await Producto.findById(mov.producto);
    if (!prod) return [null, new Error("Producto no encontrado")];
    
    const tipoInverso = mov.tipo === "entrada" ? "salida" : "entrada";
    if (tipoInverso === "salida" && prod.stock_actual < mov.cantidad) {
      return [null, new Error("Stock insuficiente para revertir este movimiento")];
    }
    prod.stock_actual += (tipoInverso === "entrada" ? mov.cantidad : -mov.cantidad);
    await prod.save();

    const reverso = new Movimiento({
      tipo: tipoInverso,
      producto: mov.producto,
      cantidad: mov.cantidad,
      motivo: `Reverso de movimiento ${mov._id}`,
      usuario,
      observaciones: mov.observaciones || "",
      reverso_de: mov._id,
    });

    const saved = await reverso.save();

    mov.revertido = true;
    await mov.save();

    return [saved, null];
  } catch (error) {
    return [null, handleError(error)];
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
