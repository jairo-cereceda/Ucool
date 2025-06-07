import { Producto, Proveedor, Foto } from "../models/models.js";
import mongoose from "mongoose";

export const obtenerProductosConFotos = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const productos = await Producto.aggregate([
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
        },
      },
      {
        $lookup: {
          from: "Fotos",
          localField: "_id",
          foreignField: "id_relacion",
          as: "fotos",
        },
      },
    ]);

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos con fotos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID no válido" });
    }

    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const producto = await Producto.aggregate([
      {
        $match: { _id: objectId },
      },
      {
        $lookup: {
          from: "Fotos",
          localField: "_id",
          foreignField: "id_relacion",
          as: "fotos",
        },
      },
    ]);

    if (producto.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(producto[0]);
  } catch (error) {
    console.error("Error en getProducto:", error);
    res.status(500).json({ mensaje: "Error al obtener producto", error });
  }
};

//Obtener producto por categoria
export const obtenerProductosCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de categoría inválido." });
    }

    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acceso no autorizado." });
    }

    const productos = await Producto.aggregate([
      {
        $match: {
          establecimiento_id: new mongoose.Types.ObjectId(
            req.user.establecimiento_id
          ),
          categoria_id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "Fotos",
          localField: "_id",
          foreignField: "id_relacion",
          as: "fotos",
        },
      },
    ]);

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

//Crear un producto
export const crearProducto = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const parsedProduct = JSON.parse(req.body.producto);

    const {
      nombre,
      descripcion,
      sku,
      codigo_barras,
      precio_venta,
      precio_compra,
      stock,
      stock_minimo,
      proveedor_id,
      categoria_id,
    } = parsedProduct;

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      sku,
      codigo_barras,
      precio_venta,
      precio_compra,
      stock,
      stock_minimo,
      proveedor_id,
      categoria_id,
      establecimiento_id: req.user.establecimiento_id,
    });

    const productoGuardado = await nuevoProducto.save();

    let fotoGuardada = null;

    if (req.file) {
      const nuevaFoto = new Foto({
        url: `/uploads/${req.file.filename}`,
        tipo: "producto",
        fecha_actualizacion: new Date(),
        id_relacion: productoGuardado._id,
      });

      fotoGuardada = await nuevaFoto.save();
    }

    res.status(201).json({
      mensaje: "Producto e imagenes insertados",
      producto: productoGuardado,
      foto: fotoGuardada,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ mensaje: "Error de validación", errores: error.errors });
    }
    res
      .status(500)
      .json({ mensaje: "Error del servidor.", error: error.message });
  }
};

//Actualizar una producto
export const actualizarProducto = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    let productoData;
    try {
      productoData = JSON.parse(req.body.producto);
    } catch (error) {
      return res.status(400).json({ mensaje: "Formato de producto inválido" });
    }

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    if (
      producto.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar este producto." });
    }

    Object.assign(producto, productoData);
    const productoActualizado = await producto.save();

    let imagenActualizada = null;

    if (req.file) {
      const imagenID = productoData.imagenAnteriorID;

      if (imagenID) {
        await Foto.findByIdAndDelete(imagenID);
      }

      const nuevaFoto = new Foto({
        url: `/uploads/${req.file.filename}`,
        tipo: "producto",
        fecha_actualizacion: new Date(),
        id_relacion: producto._id,
      });
      imagenActualizada = await nuevaFoto.save();
    }

    res.json({ productoActualizado, imagenActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto", error });
  }
};

//Eliminar una producto
export const eliminarProducto = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    if (
      producto.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para eliminar este producto." });
    }
    await producto.deleteOne();
    res.json({ mensaje: "Producto eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto", error });
  }
};

//Procedure
export const obtenerProductosBajoStock = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const pipeline = [
      {
        $match: {
          establecimiento_id: req.user.establecimiento_id,
          $expr: { $lte: ["$stock", "$stock_minimo"] },
          activo: true,
        },
      },
      {
        $lookup: {
          from: "Proveedores",
          localField: "proveedor_id",
          foreignField: "_id",
          as: "datosProveedor",
        },
      },
      {
        $unwind: {
          path: "$datosProveedor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          producto_id: "$_id",
          nombre_producto: "$nombre",
          sku: "$sku",
          stock_actual: "$stock",
          stock_minimo: "$stock_minimo",
          proveedor_nombre: { $ifNull: ["$datosProveedor.nombre", "N/D"] },
          proveedor_telefono: { $ifNull: ["$datosProveedor.telefono", "N/D"] },
          proveedor_email: { $ifNull: ["$datosProveedor.email", "N/D"] },
        },
      },
      {
        $sort: { stock_actual: 1 },
      },
    ];

    const productosBajoStock = await Producto.aggregate(pipeline);

    if (!productosBajoStock || productosBajoStock.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay productos con bajo stock." });
    }

    res.json(productosBajoStock);
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor", error: error.message });
  }
};
