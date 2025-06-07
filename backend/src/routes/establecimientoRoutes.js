import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerEstablecimientos,
  getEstablecimiento,
  crearEstablecimiento,
  actualizarEstablecimiento,
  eliminarEstablecimiento,
} from "../controllers/establecimientoController.js";

const router = express.Router();

router.get("/", protect, obtenerEstablecimientos);
router.get("/:id", protect, getEstablecimiento);
router.post("/", protect, crearEstablecimiento);
router.put("/:id", protect, actualizarEstablecimiento);
router.delete("/:id", protect, eliminarEstablecimiento);

export default router;
