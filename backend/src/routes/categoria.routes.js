"use strict";

import express from "express";
import categoriaController from "../controllers/categoria.controller.js";
import { isTrabajador } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router();
router.use(authenticationMiddleware);
// Rutas base: /api/categorias

router.get("/getCategoriasConDetalleProductos",isTrabajador, categoriaController.getCategoriasConDetalleProductos);
router.get("/",isTrabajador, categoriaController.getAllCategorias);
router.post("/", isTrabajador,categoriaController.createCategoria);
router.get("/:id",isTrabajador, categoriaController.getCategoriaById);
router.put("/:id",isTrabajador, categoriaController.updateCategoria);
router.delete("/:id",isTrabajador,categoriaController.deleteCategoria);

export default router;
