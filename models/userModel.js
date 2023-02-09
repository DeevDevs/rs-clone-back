const mongoose = require("mongoose");
const validator = require("validator");

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
  bio: {
    type: String,
    default: "Please, tell us about yourself a little.",
  },
  bio: {
    type: String,
  },
  age: {
    type: Number,
  },
  statsID: {
    type: String,
    default: "",
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
      validator: function (passCopy) {
        return passCopy === this.password;
      },
      message: "Passwords have to match",
    },
  },
});

userSchema.pre("save", async function (next) {
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
