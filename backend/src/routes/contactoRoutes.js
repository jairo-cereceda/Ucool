import express from "express";
import { enviarEmailContacto } from "../controllers/contactoController.js";

const router = express.Router();

router.post("/", enviarEmailContacto);

export default router;
