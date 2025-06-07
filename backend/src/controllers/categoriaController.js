import { Categoria, Foto } from "../models/models.js";
import mongoose from "mongoose";

//Obtener todas las categorias
export const obtenerCategorias = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const categorias = await Categoria.aggregate([
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

    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categoria:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener categoria", error: error.message });
  }
};

export const getCategoria = async (req, res) => {
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

    const categoria = await Categoria.aggregate([
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

    if (categoria.length === 0) {
      return res.status(404).json({ mensaje: "categoria no encontrada" });
    }

    res.json(categoria[0]);
  } catch (error) {
    console.error("Error en getCategoria:", error);
    res.status(500).json({ mensaje: "Error al obtener categoria", error });
  }
};

//Crear una devolucion
export const crearCategoria = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res
        .status(403)
        .json({ mensaje: "Usuario no asociado a un establecimiento." });
    }

    const parsedCategory = JSON.parse(req.body.categoria);

    const { nombre, descripcion } = parsedCategory;

    const nuevaCategoria = new Categoria({
      nombre,
      descripcion,
      establecimiento_id: req.user.establecimiento_id,
    });

    const categoriaGuardada = await nuevaCategoria.save();

    let fotoGuardada = null;

    if (req.file) {
      const nuevaFoto = new Foto({
        url: `/uploads/${req.file.filename}`,
        tipo: "categoria",
        fecha_actualizacion: new Date(),
        id_relacion: categoriaGuardada._id,
      });

      fotoGuardada = await nuevaFoto.save();
    }

    res.status(201).json({
      mensaje: "Categoría e imagenes insertados",
      categoria: categoriaGuardada,
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

//Actualizar una devolucion
export const actualizarCategoria = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    let categoriaData;
    try {
      categoriaData = JSON.parse(req.body.categoria);
    } catch (error) {
      return res.status(400).json({ mensaje: "Formato de categoria inválido" });
    }

    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoria no encontrado." });
    }

    if (
      categoria.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para modificar esta categoria." });
    }

    Object.assign(categoria, categoriaData);
    const categoriaActualizada = await categoria.save();

    let imagenActualizada = null;

    if (req.file) {
      const imagenID = categoriaData.imagenAnteriorID;

      if (imagenID) {
        await Foto.findByIdAndDelete(imagenID);
      }

      const nuevaFoto = new Foto({
        url: `/uploads/${req.file.filename}`,
        tipo: "categoria",
        fecha_actualizacion: new Date(),
        id_relacion: categoria._id,
      });
      imagenActualizada = await nuevaFoto.save();
    }

    res.json({ categoriaActualizada, imagenActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar categoria", error });
  }
};

//Eliminar una devolucion
export const eliminarCategoria = async (req, res) => {
  try {
    if (!req.user || !req.user.establecimiento_id) {
      return res.status(403).json({ mensaje: "Acción no autorizada." });
    }

    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoria no encontrada." });
    }

    if (
      categoria.establecimiento_id.toString() !==
      req.user.establecimiento_id.toString()
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar esta categoria.",
      });
    }

    await categoria.deleteOne();
    res.json({ mensaje: "Categoria eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar categoria:", error);
    res.status(500).json({
      mensaje: "Error al eliminar categoria",
      error: error.message,
    });
  }
};
