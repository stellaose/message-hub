import { Router } from "express";
import FavouriteController from "../controller/FavouriteController.js";

const router = Router();


router.post("/new/:contactId", FavouriteController.createFavourite)
router.get("/all", FavouriteController.getAllFavourite)
router.delete("/remove/:favouriteId", FavouriteController.deleteFavourite)

export default router;