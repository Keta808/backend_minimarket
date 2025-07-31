"use strict";

import Joi from "joi";

const productoBodySchema = Joi.object({
  nombre_base: Joi.string().trim().required(),
  presentacion: Joi.string().trim().required(),
  unidad_empaque: Joi.string().trim().required(),
  categoria: Joi.string().trim().required(),
  stock_actual: Joi.number().min(0).required(),
  stock_minimo: Joi.number().min(0).optional(),
  codigo_interno: Joi.string().optional().allow(""),
  activo: Joi.boolean().required(),
  usuario: Joi.string().hex().length(24).required(),
});

const productoIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export default {
  productoBodySchema,
  productoIdSchema,
};
