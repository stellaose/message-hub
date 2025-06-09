import { Router } from "express";
import FavouriteController from "../controller/FavouriteController.js";

const router = Router();


router.post("/new/:contactId", FavouriteController.createFavourite)

export default router;