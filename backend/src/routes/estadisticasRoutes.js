import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  obtenerIngresosMesActual,
  obtenerIngresosMesAnterior,
  obtenerGastosMesActual,
  obtenerGastosMesAnterior,
  obtenerProductoMasVendido,
  obtenerProductoMenosVendido,
  obtenerProductoMayorIngreso,
  obtenerProductoMenorIngreso,
  obtenerProductoMayorMargenBeneficio,
  obtenerProductoMenorMargenBeneficio,
  obtenerProductoMayorBeneficio,
  obtenerProductoMenorBeneficio,
} from "../controllers/estadisticasController.js";

const router = express.Router();

router.get("/obtenerIngresosMesActual", protect, obtenerIngresosMesActual);
router.get("/obtenerIngresosMesAnterior", protect, obtenerIngresosMesAnterior);
router.get("/obtenerGastosMesActual", protect, obtenerGastosMesActual);
router.get("/obtenerGastosMesAnterior", protect, obtenerGastosMesAnterior);
router.get("/obtenerProductoMasVendido", protect, obtenerProductoMasVendido);
router.get(
  "/obtenerProductoMenosVendido",
  protect,
  obtenerProductoMenosVendido
);
router.get(
  "/obtenerProductoMayorIngreso",
  protect,
  obtenerProductoMayorIngreso
);
router.get(
  "/obtenerProductoMenorIngreso",
  protect,
  obtenerProductoMenorIngreso
);
router.get(
  "/obtenerProductoMayorMargenBeneficio",
  protect,
  obtenerProductoMayorMargenBeneficio
);
router.get(
  "/obtenerProductoMenorMargenBeneficio",
  protect,
  obtenerProductoMenorMargenBeneficio
);
router.get(
  "/obtenerProductoMayorBeneficio",
  protect,
  obtenerProductoMayorBeneficio
);
router.get(
  "/obtenerProductoMenorBeneficio",
  protect,
  obtenerProductoMenorBeneficio
);

export default router;
