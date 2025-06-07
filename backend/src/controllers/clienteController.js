import { Venta, DetalleVenta, Producto, Cliente } from "../models/models.js";

//Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const clientes = await Cliente.find({
      establecimiento_id: req.user.establecimiento_id,
    });

    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener cliente", error: error.message });
  }
};

//Crear un cliente
export const crearCliente = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const { nombre, telefono, nif, direccion, email } = req.body;

    const nuevoCliente = new Cliente({
      nombre,
      telefono,
      nif,
      direccion,
      email,
      establecimiento_id: req.user.establecimiento_id,
    });

    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res.status(500).json({
      mensaje: "Error del servidor al crear cliente.",
      error: error.message,
    });
  }
};

//Actualizar un cliente
export const actualizarCliente = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado." });
    }

    if (
      cliente.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar este cliente." });
    }

    Object.assign(cliente, req.body);
    const clienteActualizado = await cliente.save();

    res.json(clienteActualizado);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        mensaje: "Error de validación al actualizar",
        errores: error.errors,
      });
    }
    res
      .status(500)
      .json({ mensaje: "Error al actualizar cliente", error: error.message });
  }
};

//Eliminar un cliente
export const eliminarCliente = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ mensaje: "cliente no encontrado." });
    }

    if (
      cliente.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar este cliente." });
    }

    await cliente.deleteOne();
    res.json({ mensaje: "Cliente eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar cliente", error: error.message });
  }
};

//Procedure
export const obtenerHistorialVentasCliente = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const { clienteId } = req.params;

    const cliente = await Cliente.findOne({
      _id: clienteId,
      establecimiento_id: req.user.establecimiento_id,
    });

    if (!cliente) {
      return res.status(400).json({
        mensaje: "Cliente no encontrado o no tienes acceso a este cliente.",
      });
    }

    const pipeline = [
      {
        $match: { cliente_id: new mongoose.Types.ObjectId(clienteId) },
      },
      {
        $sort: { creado_en: -1 },
      },
      {
        $lookup: {
          from: "Detalle_venta",
          localField: "_id",
          foreignField: "venta_id",
          as: "detalles",
        },
      },
      {
        $unwind: "$detalles",
      },
      {
        $lookup: {
          from: "Productos",
          localField: "detalles.producto_id",
          foreignField: "_id",
          as: "productoInfo",
        },
      },
      {
        $unwind: "$productoInfo",
        preserveNullAndEmptyArrays: true,
      },
      {
        $group: {
          _id: "$_id",
          fecha_venta: { $first: "$creado_en" },
          metodo_pago: { $first: "$metodo_pago" },
          total_venta: { $first: "$total" },
          estado_venta: { $first: "$estado" },

          productos_comprados: {
            $push: {
              producto_id: "$productoInfo._id",
              nombre_producto: {
                $ifNull: ["$productoInfo.nombre", "Producto no disponible"],
              },
              cantidad: "$detalles.cantidad",
              precio_unitario: "$detalles.precio_unitario",
              subtotal_detalle: "$detalles.subtotal",
            },
          },
        },
      },
      {
        $sort: { fecha_venta: -1 },
      },
      {
        $project: {
          _id: 0,
          id_venta: "$_id",
          fecha_venta: 1,
          metodo_pago: 1,
          total_venta: { $toString: "$total_venta" },
          estado_venta: 1,
          productos_comprados: {
            $map: {
              input: "$productos_comprados",
              as: "prod",
              in: {
                producto_id: "$$prod.producto_id",
                nombre_producto: "$$prod.nombre_producto",
                cantidad: "$$prod.cantidad",
                precio_unitario: { $toString: "$$prod.precio_unitario" },
                subtotal_detalle: { $toString: "$$prod.subtotal_detalle" },
              },
            },
          },
        },
      },
    ];

    const historial = await Venta.aggregate(pipeline);

    if (!historial || historial.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron ventas para este cliente." });
    }

    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial de ventas:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
