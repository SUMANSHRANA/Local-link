const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
  },
  { collection: "subCategory_mst" }
);

module.exports = mongoose.model("SubCategory", subCategorySchema, "subCategory_mst");
