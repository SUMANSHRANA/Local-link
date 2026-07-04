const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    cityName: String,
    stateName: String,
    countryName: String,
    isActive: { type: Boolean, default: true },
  },
  { collection: "cities_mst" }
);

module.exports = mongoose.model("City", citySchema, "cities_mst");
