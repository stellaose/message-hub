import { Favourite } from "../models/FavouriteModel.js";
import { Contact } from "../models/ContactModel.js";
// import dotenv from dotenv
import validateEmail from "../utils/ValidateEmail.js";
import ErrorResponse from "../utils/ErrorHandler.js";

const FavouriteController = {
  createFavourite: async (req, res, next) => {
    try {
      const { contactId } = req.params;

      const findContact = await Contact.findOne({ contactId });

      console.log(findContact.phoneNumber, "find contact");

      if (!findContact) {
        return next(new ErrorResponse("Contact does not exist", 400));
      }

      // Check if this contact is already a favourite
      const existingFavourite = await Favourite.findOne({ contactId });
      if (existingFavourite) {
        return next(new ErrorResponse("Contact is already in favourites", 400));
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

      const favouriteContact = await Favourite.create({
        contactId,
        firstName,
        lastName,
        phoneNumber,
        email,
        profession,
        companyName,
        dob,
        isFavourite: true,
      });

      res.status(200).json({
        success: true,
        favouriteContact,
      });
    } catch (error) {
      return next(error);
    }
  },
  getAllFavourite: async () => {},
  deleteFavourite: async () => {},
};

export default FavouriteController;
