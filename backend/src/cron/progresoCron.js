import cron from "node-cron";
import { guardarProgresoMensual } from "../controllers/progresoController.js";

cron.schedule("0 1 1 * *", async () => {
  await guardarProgresoMensual();
});
