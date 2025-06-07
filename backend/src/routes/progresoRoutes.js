import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerProgresos,
  crearProgreso,
} from "../controllers/progresoController.js";

const router = express.Router();

router.get("/", protect, obtenerProgresos);
router.post("/", protect, crearProgreso);

export default router;
