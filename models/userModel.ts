import mongoose from "mongoose";
import validator from "validator";
// import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: [true, "You have to provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "You have to provide an email address"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "You have to provide a valid email address"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  statsID: {
    type: String,
    required: [true, "You must have stats created for you"],
  },
  memoirIDs: {
    type: [String],
    required: [true, "You must have memoirs bank created for you"],
  },
  password: {
    type: String,
    required: [true, "You have to create a password"],
    trim: true,
    minLength: [8, "Your password should be at least 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "You have to confirm your password"],
    trim: true,
    validate: {
      validator: function (passCopy: string) {
        return passCopy === this.password;
      },
      message: "Passwords have to match",
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
