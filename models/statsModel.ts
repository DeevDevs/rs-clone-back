import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  places: {
    type: Number,
    unique: false,
    required: [true, "You have to provide a number of places visited"],
  },
  averageRate: {
    type: Number,
    unique: false,
    required: [true, "You have to provide an average rate"],
  },
  sites: {
    type: [String],
    unique: false,
  },
  countries: {
    type: [String],
    unique: false,
  },
  continents: {
    type: [String],
    unique: false,
  },
});

const Stats = mongoose.model("Stats", statsSchema);

export default Stats;
