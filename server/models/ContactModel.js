import mongoose from "mongoose";
import validator from "validator";

const { Schema, model } = mongoose;
const { isEmail, isDate } = validator;

const ContactSchema = new Schema(
  {
    contactId: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        return `contact-${timestamp}${randomString}`;
      },
    },
    firstName: {
      type: String,
      trim: true,
      lowercase:true,
      required: false,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase:true,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          const cleanNumber = v.replace(/[\s\-\(\)]/g, "");

          // Must start with 0 or +
          if (cleanNumber.startsWith("0")) {
            return /^0\d{9,10}$/.test(cleanNumber);
          } else if (cleanNumber.startsWith("+")) {
            return /^\+\d{10,14}$/.test(cleanNumber);
          }
          return false;
        },
        message:
          "Phone number must start with 0 (local) or + (international) and have valid format",
      },
    },
    email: {
      type: String,
      trim: true,
      required: false,
      lowercase: true,
      validate: [isEmail, "Please enter your email"],
    },
    profession: {
      type: String,
      trim: true,
      lowercase:true,
      required: false,
    },
    companyName: {
      type: String,
      trim: true,
      lowercase:true,
      required: false,
    },
    dob: {
      type: String,
      trim: true,
      lowercase:true,
      required: false,
      validate: [isDate, "Please enter a valid date"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to ensure consistent formatting
ContactSchema.pre("save", function (next) {
  if (this.phoneNumber) {
    // Ensure it's a string and properly formatted
    this.phoneNumber = String(this.phoneNumber).trim();
  }
  next();
});

export const Contact = model("Contact", ContactSchema);
