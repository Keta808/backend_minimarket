"use strict";

import Joi from "joi";

const categoriaBodySchema = Joi.object({
  nombre: Joi.string().trim().required(),
  descripcion: Joi.string().allow("").optional(),
});

const categoriaIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export default {
  categoriaBodySchema,
  categoriaIdSchema,
};
