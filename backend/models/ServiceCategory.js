const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    categoryDescription: String,
    citiesAvailable: [String],
    imagePath: String,
    isActive: { type: Boolean, default: true },
  },
  { collection: "serviceCategory_mst" }
);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema, "serviceCategory_mst");
