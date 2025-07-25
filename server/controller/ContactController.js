import { Contact } from "../models/ContactModel.js";
import { Favourite } from "../models/FavouriteModel.js";
// import dotenv from dotenv
import validateEmail from "../utils/ValidateEmail.js";
import ErrorResponse from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/ApiFeatures.js";

const ContactController = {
  createContact: async (req, res, next) => {
    try {
      if (!req.body) {
        return next(
          new ErrorResponse("Please enter your a credential to continue.", 400)
        );
      }
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        profession,
        companyName,
        dob,
      } = req.body;

      if (!phoneNumber) {
        return next(
          new ErrorResponse("Please enter your phone number to continue", 400)
        );
      }

      if (email) {
        if (!validateEmail(email)) {
          return next(new ErrorResponse("Please enter a valid email.", 403));
        }
      }

      const findContact = await Contact.findOne({ phoneNumber });

      if (findContact) {
        return next(
          new ErrorResponse("This number has already been saved.", 403)
        );
      }

      const saveContact = await Contact.create({
        firstName,
        lastName,
        phoneNumber,
        email,
        profession,
        companyName,
        dob,
      });

      res.status(201).json({
        success: true,
        message:"Contact created successfully",
        saveContact,
      });
    } catch (error) {
      return next(error);
    }
  },

  // getAllProducts: async (req, res, next) => {
  //   try{
  //     const resultPerPage = 12;
  //     const countProduct = await Product.countDocuments();

  //     const apiFeature = new ApiFeatures(Product.find(), req.query)
  //     .search()
  //     .filter()

  //     apiFeature.pagination(resultPerPage)

  //     let findProduct = await apiFeature.query

  //     let filteredProductCount = findProduct.length;

  //     findProduct = await apiFeature.query.clone()

  //     if(findProduct){
  //       return res.json({
  //         status: 200,
  //         success: true,
  //         findProduct,
  //         countProduct,
  //         resultPerPage,
  //         filteredProductCount
  //       })
  //     }
  //   } catch(err){
  //     console.log(err);
  //       return next
  //         (new ErrorResponse('Server error', 500))
  //   }
  // },

  getAllContacts: async (req, res, next) => {
    try {
      const apiFeature = new ApiFeatures(
        Contact.find().select("-createdAt -updatedAt -_id"),
        req.query
      )
        .search()
        .filter();

      let allContacts = await apiFeature.query;

      if (allContacts) {
        res.status(200).json({
          success: true,
          allContacts,
        });
      }
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

  updateContact: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        profession,
        companyName,
        dob,
      } = req.body;
      const { contactId } = req.params;

      // ! check if the contact exist
      const existingContact = await Contact.findOne({ contactId });

      if (!existingContact) {
        return next(new ErrorResponse("Contact does not exist", 404));
      }

      const updatedContactData = {
        firstName,
        lastName,
        phoneNumber,
        email,
        profession,
        companyName,
        dob,
      };

      const oneContact = await Contact.findOneAndUpdate(
        { contactId },
        updatedContactData,
        {
          new: true,
          runValidators: true,
        }
      );

      // # check if it the contact ia also a favourite and update
      const favouriteContact = await Favourite.findOne({
        contactId: existingContact.contactId,
      });

      if (favouriteContact  && oneContact) {
        await Favourite.findOneAndUpdate(
          { contactId: existingContact.contactId },
          updatedContactData,
          {
            new: true,
            runValidators: true,
          }
        );
      }

      res.status(201).json({
        success: true,
        message: "Contact updated successfully",
        oneContact,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default ContactController;
