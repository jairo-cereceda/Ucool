import { Foto } from "../models/models.js";
import fs from "fs";
import path from "path";

//Obtener todas los fotos
export const obtenerFotos = async (req, res) => {
  try {
    const fotos = await Foto.find();
    res.json(fotos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener fotos", error });
  }
};

export const getFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const foto = await Foto.findOne({ id_relacion: id });

    res.json(foto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener foto", error });
  }
};

//Crear una foto
export const crearFoto = async (req, res) => {
  try {
    const nuevoFoto = new Foto(req.body);
    await nuevoFoto.save();
    res.status(201).json(nuevoFoto);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear foto", error });
  }
};

//Actualizar una foto
export const actualizarFoto = async (req, res) => {
  try {
    const idRelacion = req.params.id;

    if (!idRelacion) {
      return res.status(400).json({ mensaje: "Falta el ID de la imagen" });
    }

    const fotoExistente = await Foto.findOne({ id_relacion: idRelacion });

    let imagenActualizada;
    if (!fotoExistente && req.file) {
      const nuevaFoto = new Foto({
        url: `/uploads/${req.file.filename}`,
        tipo: "usuario",
        fecha_actualizacion: new Date(),
        id_relacion: idRelacion,
      });
      imagenActualizada = await nuevaFoto.save();
    }
    // return res.status(404).json({ mensaje: "Foto no encontrada" });
    else if (req.file) {
      const rutaAnterior = path.join("public", fotoExistente.url);

      if (fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }

      fotoExistente.url = `/uploads/${req.file.filename}`;
      fotoExistente.fecha_actualizacion = new Date();
      imagenActualizada = await fotoExistente.save();
    }

    res.json(imagenActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar foto", error });
  }
};

//Eliminar una foto
export const eliminarFoto = async (req, res) => {
  try {
    await Foto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Foto eliminada" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar foto", error });
  }
};
