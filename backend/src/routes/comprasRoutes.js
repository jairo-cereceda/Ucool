import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  obtenerCompras,
  crearCompras,
  getCompra,
  actualizarCompra,
  eliminarCompra,
} from "../controllers/comprasController.js";

const router = express.Router();

router.get("/", protect, obtenerCompras);
router.get("/:id", protect, getCompra);
router.post("/", protect, upload.single("foto"), crearCompras);
router.put("/:id", protect, upload.single("foto"), actualizarCompra);
router.delete("/:id", protect, eliminarCompra);

export default router;
