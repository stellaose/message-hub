import { Hidden } from "../models/HiddenModel.js";
import { Contact } from "../models/ContactModel.js";
// import dotenv from dotenv
import validateEmail from "../utils/ValidateEmail.js";
import ErrorResponse from "../utils/ErrorHandler.js";

const HiddenController = {
  createHidden: async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const findContact = await Contact.findOne({
        contactId,
      });

      if (!findContact) {
        return next(new ErrorResponse("Contact does not exist", 404));
      }

      // check if it is hidden
      const alreadyHidden = await Hidden.findOne({
        contactId,
      });

      if (alreadyHidden) {
        return next(new ErrorResponse("Contact already deleted", 400));
      }

      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        profession,
        companyName,
        dob,
      } = findContact;

      const hideContact = await Hidden.create({
        contactId,
        firstName,
        lastName,
        phoneNumber,
        email,
        profession,
        companyName,
        dob,
        isHidden: true,
      });

      if (hideContact) {
        await Contact.findOneAndDelete({ contactId });

        res.status(201).json({
          success: true,
          message: "Contact deleted",
          hideContact,
        });
      } else {
        return next(new ErrorResponse("Contact could not be deleted", 400));
      }
    } catch (error) {
      return next(error);
    }
  },
  getAllHidden: async (req, res, next) => {
    try {
      const allHiddenContacts = await Hidden.find().select(
        "-createdAt -updatedAt -_id"
      );

      res.status(200).json({
        success: true,
        message: "Contact gotten successfully",
        allHiddenContacts,
      });
    } catch (error) {
      return next(error);
    }
  },
  restoreHidden: async (req, res, next) => {
    try {
      const { contactId } = req.params;
      
      

      const checkIfHidden = await Hidden.findOne({ contactId });

      if (!checkIfHidden) {
        return next(new ErrorResponse("Contact does not exist", 404));
      }

      const deleteHidden = await Hidden.findOneAndDelete({ contactId });

      if (deleteHidden) {
        const {
          firstName,
          lastName,
          phoneNumber,
          email,
          profession,
          companyName,
          dob,
        } = checkIfHidden;

        const contactCreated = await Contact.create({
          contactId,
          firstName,
          lastName,
          phoneNumber,
          email,
          profession,
          companyName,
          dob,
        });

        res.status(200).json({
          success: true,
          message: "Contact restored successfully",
          contactCreated,
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  deleteHidden: async (req, res, next) => {
    try {
      const { contactId } = req.params;
      
      const deleteHidden = await Hidden.findOneAndDelete({ contactId })
      
      if (deleteHidden) {
        res.status(200).json({
          status: true,
          message: 'Contact deleted successfully'
        })
      }
    } catch (error) {
      return next(error);
    }
  },
};

export default HiddenController;
