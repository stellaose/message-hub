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

      if (!findContact) {
        return next(new ErrorResponse("Contact does not exist", 404));
      }

      // Check if this contact is already a favourite
      const existingFavourite = await Favourite.findOne({ contactId });
      if (existingFavourite) {
        return next(new ErrorResponse("Contact is already in favourites", 403));
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

      res.status(201).json({
        success: true,
        message:'Favourite created successfully',
        favouriteContact,
      });
    } catch (error) {
      return next(error);
    }n
  },
  getAllFavourite: async (req, res, next) => {
    try {
      const allFavourites = await Favourite.find().select(
        "-createdAt -updatedAt -_id"
      );

      res.status(200).json({
        success: true,
        message: "Favourites gotten successfully",
        allFavourites,
      });
    } catch (error) {
      return next(error);
    }
  },
  deleteFavourite: async (req, res, next) => {
    try {
      const { favouriteId } = req.params;

      const findFavourite = await Favourite.findOneAndDelete({ favouriteId });
      if (findFavourite) {
        res.status(200).json({
          success: true,
          message: "Favourite deleted successfully",
        });
      }
    } catch (error) {
      return next(error);
    }
  },
};

export default FavouriteController;
