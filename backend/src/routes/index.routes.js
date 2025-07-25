"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Enrutador de productos */

import productoRoutes from "./producto.routes.js";

/** Enrutador de Movimientos */

import movimientoRoutes from "./movimiento.route.js";

/** Enrutador de Categorias */

import categoriaRoutes from "./categoria.routes.js";

/** Enrutador de Stock */

import stockRoutes from "./stock.route.js";

/** Instancia del enrutador */
const router = Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);
// Define las rutas para los productos 
router.use("/productos", productoRoutes);
// Define las rutas para los movimientos
router.use("/movimientos", movimientoRoutes);
// Define las rutas para las categorias
router.use("/categoria", categoriaRoutes);
// Define las rutas de stock 
router.use("/stock", stockRoutes);


// Exporta el enrutador
export default router;
