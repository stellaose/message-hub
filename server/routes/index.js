import { Router } from "express";
import ContactRoutes from "./ContactRoutes.js";
import FavouriteRoutes from "./FavouriteRoutes.js";
import HiddenRoutes from "./HiddenRoutes.js";

const router = Router();

router.use("/contact", ContactRoutes);
router.use("/favourite", FavouriteRoutes);
router.use("/hidden", HiddenRoutes);

export default router;
