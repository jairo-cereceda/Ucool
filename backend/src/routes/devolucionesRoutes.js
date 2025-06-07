import express from "express";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerDevoluciones,
  crearDevolucion,
  actualizarDevolucion,
  eliminarDevolucion,
} from "../controllers/devolucionController.js";

const router = express.Router();

router.get("/", protect, obtenerDevoluciones);
router.post("/", protect, upload.single("foto"), crearDevolucion);
router.put("/:id", protect, actualizarDevolucion);
router.delete("/:id", protect, eliminarDevolucion);

export default router;
