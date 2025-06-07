import { Usuario } from "../models/models.js";
import { hashPassword } from "../services/userService.js";
import mongoose from "mongoose";

//Obtener todas los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({
      establecimiento_id: req.user.establecimiento_id,
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

export const getUsuario = async (req, res) => {
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

    const usuario = await Usuario.findById(objectId);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrada" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error en getUsuario:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario", error });
  }
};

//Crear una usuario
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, telefono, nif, email, password, rol } = req.body;
    const hash = await hashPassword(password);
    const nuevoUsuario = new Usuario({
      nombre,
      telefono,
      nif,
      email,
      password: hash,
      rol,
    });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear usuario", error });
  }
};

//Actualizar una usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const clienteActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar usuario", error });
  }
};

//Eliminar una usuario
export const eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Usuario eliminada" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar usuario", error });
  }
};
