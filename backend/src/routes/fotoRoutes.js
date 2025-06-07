import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  obtenerFotos,
  getFoto,
  crearFoto,
  actualizarFoto,
  eliminarFoto,
} from "../controllers/fotoController.js";

const router = express.Router();

router.get("/", obtenerFotos);
router.get("/:id", protect, getFoto);
router.post("/", crearFoto);
router.put("/:id", protect, upload.single("foto"), actualizarFoto);
router.delete("/:id", eliminarFoto);

export default router;
