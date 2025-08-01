"use strict";

/** Modelo de datos 'User' */
import User from "../models/user.model.js";
/** Modulo 'jsonwebtoken' para crear tokens */
import jwt from "jsonwebtoken";

import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";

import { handleError } from "../utils/errorHandler.js";

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario
 */
async function login(user) {
  try {
    const { email, password } = user;
    const userFound = await User.findOne({ email: email })
      .populate("roles")
      .exec();
    if (!userFound) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }
    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const accessToken = jwt.sign(
      { email: userFound.email, roles: userFound.roles, id: userFound._id },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = jwt.sign(
      { email: userFound.email },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "30d", 
      },
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "auth.service -> signIn");
  }
}

/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
const refresh = async (cookies) => {
  try {
    const token = cookies.jwt;
    if (!token) return [null, null, "No hay token"];
    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    
    const user = await User.findOne({ email: decoded.email }).select("-password").populate("roles");
  
    if (!user) return [null, null, "Usuario no encontrado"];
      const accessToken = jwt.sign(
        { id: user._id, email: user.email, roles: user.roles },
        process.env.ACCESS_JWT_SECRET,
        { expiresIn: "15m" }
      );

    return [accessToken, user, null];
  } catch (error) {
    console.error("❌ Error en refresh token:", error.message);
    return [null, null, "Token inválido"];
  }
};

export default { login, refresh };
