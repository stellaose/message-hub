import { Contact } from "../models/ContactModel.js";
// import dotenv from dotenv
import validateEmail from "../utils/ValidateEmail.js";
import ErrorResponse from "../utils/ErrorHandler.js";

const ContactController = {
  createContact: async (req, res, next) => {
    try {
      if (!req.body) {
        return next(
          new ErrorResponse("Please enter your a credential to continue.", 400)
        );
      }
      const { firstName, lastName, phoneNumber, email } = req.body;

      if (!phoneNumber) {
        return next(
          new ErrorResponse("Please enter your phone number to continue", 400)
        );
      }

      if (email) {
        if (!validateEmail(email)) {
          return next(new ErrorResponse("Please enter a valid email.", 400));
        }
      }

      const findContact = await Contact.findOne({ phoneNumber });

      if (findContact) {
        return next(
          new ErrorResponse("This number has already been saved.", 400)
        );
      }

      const saveContact = await Contact.create({
        firstName,
        lastName,
        phoneNumber,
        email,
      });

      res.status(200).json({
        success: true,
        saveContact,
      });
    } catch (error) {
      return next(error);
    }
  },

  getAllContacts: async (req, res, next) => {
    try {
      const allContacts = await Contact.find().select(
        "-createdAt -updatedAt -_id"
      );

      res.status(200).json({
        success: true,
        allContacts,
      });
    } catch (error) {
      return next(error);
    }
  },

  getContactDetails: async (req, res, next) => {
    try {
      const { contactId } = req.params;

      const oneContact = await Contact.findOne({ contactId });

      if (!oneContact) {
        return next(new ErrorResponse("This contact does not exist.", 400));
      }

      res.status(200).json({
        success: true,
        oneContact,
      });
    } catch (error) {
      return next(error);
    }
  },
  
  updateContact: async () => {},
};

export default ContactController;
