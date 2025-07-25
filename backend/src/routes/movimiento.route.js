"use strict";

import express from "express";
import movimientoController from "../controllers/movimiento.controller.js";
import { isTrabajador } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router();
router.use(authenticationMiddleware);
// Rutas base: /api/categorias
// Rutas base: /api/movimientos

router.get("/", isTrabajador,movimientoController.getAllMovimiento);
router.get("/ultimosMovimientos", isTrabajador,movimientoController.getUltimosMovimientos);
router.post("/",isTrabajador, movimientoController.createMovimiento);
router.get("/:id",isTrabajador, movimientoController.getMovimientobyId);
router.put("/:id",isTrabajador, movimientoController.updateMovimiento);
router.delete("/:id",isTrabajador, movimientoController.deleteMovimiento);


export default router;
