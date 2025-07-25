"use strict";

import Joi from "joi";

const movimientoBodySchema = Joi.object({
  tipo: Joi.string().valid("entrada", "salida").required(),
  producto: Joi.string().hex().length(24).required(),
  cantidad: Joi.number().min(1).required(),
  motivo: Joi.string().required(),
  user: Joi.string().hex().length(24).required(),
  observaciones: Joi.string().allow("").optional(),
});

const movimientoIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export default {
  movimientoBodySchema,
  movimientoIdSchema,
};
