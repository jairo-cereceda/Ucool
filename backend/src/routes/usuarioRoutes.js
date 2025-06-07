import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerUsuarios,
  getUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", protect, obtenerUsuarios);
router.get("/:id", protect, getUsuario);
router.put("/:id", protect, actualizarUsuario);
router.delete("/:id", protect, eliminarUsuario);

export default router;
