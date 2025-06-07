import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerTarjetas,
  getTarjeta,
  crearTarjeta,
  actualizarTarjeta,
  eliminarTarjeta,
} from "../controllers/tarjetaController.js";

const router = express.Router();

router.get("/", protect, obtenerTarjetas);
router.get("/:id", protect, getTarjeta);

router.post("/", protect, crearTarjeta);
router.put("/:id", protect, actualizarTarjeta);
router.delete("/:id", protect, eliminarTarjeta);

export default router;
