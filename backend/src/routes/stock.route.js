"use strict";

import express from "express";
import stockController from "../controllers/stock.controller.js";

import { isTrabajador } from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.use(authenticationMiddleware);
// POST /api/stock/entrada
router.post("/entrada",isTrabajador, stockController.registrarEntrada);
router.post("/salida", isTrabajador,stockController.registrarSalida);
router.post("/entrada-masiva",isTrabajador, stockController.registrarEntradaMasiva);
router.post("/salida-masiva",isTrabajador,stockController.registrarSalidaMasiva);
router.post("/ajuste-manual",isTrabajador, stockController.ajustarStockManual);
router.post("/revertir/:id",isTrabajador, stockController.revertirMovimiento);

export default router;
