import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerDetalles,
  crearDetalle,
  actualizarDetalle,
  eliminarDetalle,
} from "../controllers/detalleVentaController.js";

const router = express.Router();

router.get("/", protect, obtenerDetalles);
router.post("/", protect, crearDetalle);
router.put("/:id", protect, actualizarDetalle);
router.delete("/:id", protect, eliminarDetalle);

export default router;
