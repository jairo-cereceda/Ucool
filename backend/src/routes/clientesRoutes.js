import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerHistorialVentasCliente,
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", protect, obtenerClientes);
router.post("/", protect, crearCliente);
router.put("/:id", protect, actualizarCliente);
router.delete("/:id", protect, eliminarCliente);

router.get(":id/Historial-ventas", protect, obtenerHistorialVentasCliente);

export default router;
