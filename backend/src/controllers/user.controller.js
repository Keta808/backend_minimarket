"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import UserService from "../services/user.service.js";
import { userBodySchema, userIdSchema,userPasswordChangeSchema } from "../schema/user.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los usuarios
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUsers(req, res) {
  try {
    const [usuarios, errorUsuarios] = await UserService.getUsers();
    if (errorUsuarios) return respondError( res, 404, errorUsuarios);

    usuarios.length === 0
      ? respondSuccess( res, 204,usuarios)
      : respondSuccess( res, 200,usuarios);
  } catch (error) {
    handleError(error, "user.controller -> getUsers");
    respondError(res, 400, error.message);
  }
}

/**
 * Crea un nuevo usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createUser(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = userBodySchema.validate(body);
    if (bodyError) return respondError( res, 400, bodyError.message);

    const [newUser, userError] = await UserService.createUser(body);

    if (userError) return respondError( res, 400, userError);
    if (!newUser) {
      return respondError(res, 400, "No se creo el usuario");
    }

    respondSuccess( res, 201, newUser);
  } catch (error) {
    handleError(error, "user.controller -> createUser");
    respondError( res, 500, "No se creo el usuario");
  }
}

/**
 * Obtiene un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getUserById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [user, errorUser] = await UserService.getUserById(params.id);

    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> getUserById");
    respondError(req, res, 500, "No se pudo obtener el usuario");
  }
}

/**
 * Actualiza un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateUser(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = userBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [user, userError] = await UserService.updateUser(params.id, body);

    if (userError) return respondError(req, res, 400, userError);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> updateUser");
    respondError(req, res, 500, "No se pudo actualizar el usuario");
  }
}

/**
 * Elimina un usuario por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteUser(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = userIdSchema.validate(params);
    if (paramsError) return respondError( res, 400, paramsError.message);

    const user = await UserService.deleteUser(params.id);
    !user
      ? respondError(
          req,
          res,
          404,
          "No se encontro el usuario solicitado",
          "Verifique el id ingresado",
        )
      : respondSuccess( res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> deleteUser");
    respondError( res, 500, "No se pudo eliminar el usuario");
  }
}

async function changePassword(req, res) {
  try {
    const { params, body } = req;
    // Validar ID del usuario
    const { error: idError } = userIdSchema.validate(params);
    if (idError) return respondError(res, 400, idError.message);

    // Validar cuerpo de la solicitud
    const { error: bodyError } = userPasswordChangeSchema.validate(body);
    if (bodyError) return respondError(res, 400, bodyError.message);

    // Lógica para cambiar contraseña
    const [result, errorChange] = await UserService.changePassword(params.id, body);
    if (errorChange) return respondError(res, 400, errorChange);

    respondSuccess(res, 200, result);
  } catch (error) {
    handleError(error, "user.controller -> changeUserPassword");
    respondError(res, 500, "No se pudo cambiar la contraseña");
  }
}


export default {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
};
