import express from "express";
import { upload } from "../middleware/upload.js";
import { processImage } from "../middleware/imageProccessor.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerCategorias,
  getCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriaController.js";

const router = express.Router();

router.get("/", protect, obtenerCategorias);
router.get("/:id", protect, getCategoria);
router.post("/", protect, upload.single("foto"), processImage, crearCategoria);
router.put(
  "/:id",
  protect,
  upload.single("foto"),
  processImage,
  actualizarCategoria
);
router.delete("/:id", protect, eliminarCategoria);

export default router;
