import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerDescuentos,
  crearDescuento,
  actualizarDescuento,
  eliminarDescuento,
} from "../controllers/descuentoController.js";

const router = express.Router();

router.get("/", protect, obtenerDescuentos);
router.post("/", protect, crearDescuento);
router.put("/:id", protect, actualizarDescuento);
router.delete("/:id", protect, eliminarDescuento);

export default router;
