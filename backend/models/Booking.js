const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    serviceCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceAgent" },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    status: { type: String, default: "Yet To Serve" },
    price: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash on Service" },
    paymentStatus: { type: String, default: "Pending" },
  },
  { timestamps: true, collection: "booking" }
);

module.exports = mongoose.model("Booking", bookingSchema, "booking");
