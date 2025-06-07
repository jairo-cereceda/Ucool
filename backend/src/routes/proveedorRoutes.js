import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  getProveedor,
  eliminarProveedor,
} from "../controllers/proveedorController.js";

const router = express.Router();

router.get("/", protect, obtenerProveedores);
router.get("/:id", protect, getProveedor);
router.post("/", protect, upload.single("foto"), crearProveedor);
router.put("/:id", protect, upload.single("foto"), actualizarProveedor);
router.delete("/:id", protect, eliminarProveedor);

export default router;
