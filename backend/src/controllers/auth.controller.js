"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import AuthService from "../services/auth.service.js";
import { authLoginBodySchema } from "../schema/auth.schema.js";


/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function login(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = authLoginBodySchema.validate(body);
    if (bodyError) return respondError( res, 400, bodyError.message);

    const [accessToken, refreshToken, errorToken] =
      await AuthService.login(body);

    if (errorToken) return respondError( res, 400, errorToken);

    
        res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "None", 
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      });

    respondSuccess( res, 200, { accessToken });
  } catch (error) {
    handleError(error, "auth.controller -> login");
    respondError( res, 400, error.message);
  }
}

/**
 * @name logout
 * @description Cierra la sesión del usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns
 */
async function logout(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    respondSuccess(res, 200, { message: "Sesión cerrada correctamente" });
  } catch (error) {
    handleError(error, "auth.controller -> logout");
    respondError(res, 400, error.message);
  }
}


/**
 * @name refresh
 * @description Refresca el token de acceso
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function refresh(req, res) {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return respondError(res, 400, "No hay token");
    const [accessToken, user, errorToken] = await AuthService.refresh(cookies);
    if (errorToken) return respondError(res, 400, errorToken);
  
    respondSuccess(res, 200, { accessToken, user }, "Token refrescado");
  } catch (error) {
    handleError(error, "auth.controller -> refresh");
    respondError(res, 400, error.message);
  }
}


export default {
  login,
  logout,
  refresh,
};
