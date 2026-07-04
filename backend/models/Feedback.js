const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true, collection: "feedback_mst" }
);

module.exports = mongoose.model("Feedback", feedbackSchema, "feedback_mst");
