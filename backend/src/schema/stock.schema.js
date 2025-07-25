"use strict";

import Joi from "joi";

const entradaStockSchema = Joi.object({
  producto: Joi.string().hex().length(24).required(),
  cantidad: Joi.number().min(1).required(),
  motivo: Joi.string().required(),
  usuario: Joi.string().hex().length(24).required(),
  observaciones: Joi.string().allow("").optional(),
});

const operacionStockSchema = Joi.object({
  producto: Joi.string().hex().length(24).required(),
  cantidad: Joi.number().min(1).required(),
  motivo: Joi.string().required(),
  usuario: Joi.string().hex().length(24).required(),
  observaciones: Joi.string().allow("").optional(),
});

const operacionMasivaSchema = Joi.object({
  usuario: Joi.string().hex().length(24).required(),
  operaciones: Joi.array().items(
    Joi.object({
      producto: Joi.string().hex().length(24).required(),
      cantidad: Joi.number().min(1).required(),
      motivo: Joi.string().required(),
      observaciones: Joi.string().allow("").optional(),
    })
  ).min(1).required(),
});

const ajusteStockSchema = Joi.object({
  producto: Joi.string().hex().length(24).required(),
  nuevo_stock: Joi.number().min(0).required(),
  motivo: Joi.string().required(),
  usuario: Joi.string().hex().length(24).required(),
  observaciones: Joi.string().allow("").optional(),
});


export default {
  entradaStockSchema,
  operacionStockSchema,
  operacionMasivaSchema,
  ajusteStockSchema

};
