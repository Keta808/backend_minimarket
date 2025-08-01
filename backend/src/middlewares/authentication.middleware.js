import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "../config/configEnv.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return respondError(
        res,
        401,
        "No autorizado",
        "No hay token válido"
      );
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, ACCESS_JWT_SECRET, (err, decoded) => {
      if (err) {
        return respondError(res, 403, "No autorizado", err.message);
      }
      
      req.email = decoded.email;
      req.roles = decoded.roles || [];
      next();
    });
  } catch (error) {
    handleError(error, "authentication.middleware -> verifyJWT");
    return respondError(res, 500, "Error interno del servidor");
  }
};

export default verifyJWT;
