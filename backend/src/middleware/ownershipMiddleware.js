import Producto from "../models/models.js";

export const checkProductOwnerShip = async (req, res, next) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({
        mensaje: "Acción no autorizada: usuario sin establecimiento.",
      });
    }

    const resourceId = req.params.id;
    const resource = await Producto.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ mensaje: "Recurso no encontrado." });
    }

    if (
      resource.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para acceder o modificar este recurso.",
      });
    }

    req.resource = resource;
    next();
  } catch (error) {
    console.error("Error en middleware de propiedad:", error);
    res
      .status(500)
      .json({ mensaje: "Error del servidor al verificar propiedad." });
  }
};
