import { Router } from "express";
import ContactController from "../controller/ContactController.js";

const router = Router();

router.post("/new", ContactController.createContact);
router.get("/all", ContactController.getAllContacts);
router.get("/one/:contactId", ContactController.getContactDetails);
router.put("/one/:contactId", ContactController.updateContact);

export default router;
