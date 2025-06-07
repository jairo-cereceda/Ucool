import express from "express";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerGastosOperativo,
  crearGastosOperativo,
  getGastoOperativo,
  actualizarGastoOperativo,
  eliminarGastosOperativo,
} from "../controllers/gastosOperativosController.js";

const router = express.Router();

router.get("/", protect, obtenerGastosOperativo);
router.get("/:id", protect, getGastoOperativo);
router.post("/", protect, upload.single("foto"), crearGastosOperativo);
router.put("/:id", protect, upload.single("foto"), actualizarGastoOperativo);
router.delete("/:id", protect, eliminarGastosOperativo);

export default router;
