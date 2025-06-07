import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerVentas,
  actualizarVenta,
  eliminarVenta,
  crearVentaTotal,
} from "../controllers/ventaController.js";

const router = express.Router();

router.get("/", protect, obtenerVentas);
router.post("/", protect, crearVentaTotal);
router.put("/:id", protect, actualizarVenta);
router.delete("/:id", protect, eliminarVenta);

export default router;
