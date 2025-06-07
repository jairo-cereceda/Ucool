import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosConFotos,
  getProducto,
  obtenerProductosCategoria,
  obtenerProductosBajoStock,
} from "../controllers/productoController.js";

const router = express.Router();

router.get("/fotos", protect, obtenerProductosConFotos);
router.get("/stock", protect, obtenerProductosBajoStock);
router.get("/:id", protect, getProducto);
router.get("/categoria/:id", protect, obtenerProductosCategoria);
router.post("/", protect, upload.single("foto"), crearProducto);
router.put("/:id", upload.single("foto"), protect, actualizarProducto);
router.delete("/:id", protect, eliminarProducto);

export default router;
