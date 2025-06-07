import express from "express";
import {
  register,
  registerEstablecimiento,
  login,
  verifyEmail,
  resendVerificationEmail,
  enviarEmailCambiarPass,
  actualizarPass,
} from "../controllers/authContoller.js";

const router = express.Router();

router.post("/register", register);
router.post("/register-establecimiento", registerEstablecimiento);
router.post("/login", login);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/email-cambiar-pass", enviarEmailCambiarPass);
router.post("/cambiar-pass/:token", actualizarPass);

export default router;
