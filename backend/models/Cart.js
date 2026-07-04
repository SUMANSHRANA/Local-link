const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
      },
    ],
  },
  { collection: "cart" }
);

module.exports = mongoose.model("Cart", cartSchema, "cart");
