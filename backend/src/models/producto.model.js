"use strict";

import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
    {
        nombre_base:{
            type: String,
            required: true,
        },
        presentacion:{
            type: String,
            required: true,
        },
        unidad_empaque: {
            type: String,
            required: true,
        },
        categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categoria",
            required: true,
            },
            
        stock_actual:{
            type: Number,
            required: true,
        },
        activo:{
            type: Boolean,
            required: true,
        },
       
    },
    {
    timestamps: true,     
    versionKey: false,
  }
);

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;