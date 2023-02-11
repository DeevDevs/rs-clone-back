const mongoose = require("mongoose");

const memoirSchema = new mongoose.Schema({
  tripName: {
    type: String,
    unique: false,
    required: [true, "You have to provide a name of the trip"],
  },
  destinationName: {
    type: String,
    unique: false,
    required: [true, "You have to provide a name of the destination"],
  },
  longLat: {
    type: [Number],
    unique: false,
    required: [true, "You have to provide geolocation of the destination"],
  },
  countryName: {
    type: String,
    unique: false,
    required: [true, "You have to provide a name of the country you visited"],
  },
  continentName: {
    type: String,
    unique: false,
  },
  whereFromLongLat: {
    type: [Number],
    unique: false,
    required: [
      true,
      "You have to provide geolocation of the place you arrived from",
    ],
  },
  distance: {
    type: Number,
    unique: false,
    required: [
      true,
      "You have to provide distance between the points on the map",
    ],
  },
  date: {
    type: Date,
    unique: false,
    required: [true, "You have to provide a date of the trip"],
  },
  rateValue: {
    type: Number,
    unique: false,
    required: [true, "You have to provide rating of the trip"],
  },
  days: {
    type: Number,
    unique: false,
    required: [true, "You have to provide a number of days in the trip"],
  },
  sites: {
    type: [String],
    unique: false,
    default: [],
  },
  memoirPhotos: {
    type: [String],
    default: ["default.jpg"],
  },
  description: {
    type: String,
    default: "So many memories... takes time to describe them",
  },
});

const Memoir = mongoose.model("Memoir", memoirSchema);

module.exports = Memoir;
