"use strict";

import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["entrada", "salida"],
      required: true,
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: {
      type: Number,
      min: 1,
      required: true,
    },
    motivo: {
      type: String,
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    observaciones: {
      type: String,
    },

    revertido: {
     type: Boolean,
     default: false,
    },
    reverso_de: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Movimiento",
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Movimiento = mongoose.model("Movimiento", movimientoSchema);
export default Movimiento;
