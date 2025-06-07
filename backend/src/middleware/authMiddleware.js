import jwt from "jsonwebtoken";
import { Usuario } from "../models/models.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await Usuario.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ mensaje: "No autorizado, usuario no encontrado." });
      }
      next();
    } catch (error) {
      console.error("Error de autenticación:", error.message);
      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ mensaje: "No autorizado, token inválido." });
      }
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ mensaje: "No autorizado, token expirado." });
      }
      res.status(401).json({ mensaje: "No autorizado, fallo en el token." });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ mensaje: "No autorizado, no se proporcionó token." });
  }
};
