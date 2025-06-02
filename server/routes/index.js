import { Router } from "express";
import ContactRoutes from "./ContactRoutes.js";

const router = Router();

router.use("/contact", ContactRoutes);

export default router;
