"use strict";

import express from "express";
import productoController from "../controllers/producto.controller.js";

import { isTrabajador } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router();
router.use(authenticationMiddleware);
// Rutas base: /api/productos

router.post("/", isTrabajador, productoController.createProducto);
router.get("/", isTrabajador,productoController.getAllProductos);
router.get("/:id", isTrabajador,productoController.getProductoById);
router.put("/:id", isTrabajador,productoController.updateProducto);
router.delete("/:id",isTrabajador, productoController.deleteProducto);

export default router;
