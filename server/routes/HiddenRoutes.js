import { Router } from "express";
import HiddenController from "../controller/HiddenController.js";

const router = Router();

router.post("/new/:contactId", HiddenController.createHidden);
router.get("/all", HiddenController.getAllHidden);
router.put("/restore/:contactId", HiddenController.restoreHidden);
router.delete("/delete/:contactId", HiddenController.deleteHidden);

export default router;
