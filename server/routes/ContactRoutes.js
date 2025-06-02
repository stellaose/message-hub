import { Router } from "express";
import ContactController from "../controller/ContactController.js";

const router = Router();

router.post("/new", ContactController.createContact);
router.get("/all", ContactController.getAllContacts);
router.get("/one/:contactId", ContactController.getContactDetails);

export default router;
