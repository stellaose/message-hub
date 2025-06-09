import { Router } from "express";
import ContactRoutes from "./ContactRoutes.js";
import FavouriteRoutes from "./FavouriteRoutes.js";

const router = Router();

router.use("/contact", ContactRoutes);
router.use("/favourite", FavouriteRoutes);

export default router;
