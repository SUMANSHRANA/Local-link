const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const serviceAgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
    },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    image: String,
    email: String,
    contact: String,
    address: String,
    experience: String,
    isApproved: { type: Boolean, default: false },
  },
  { collection: "serviceAgent_mst" }
);

serviceAgentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

serviceAgentSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("ServiceAgent", serviceAgentSchema, "serviceAgent_mst");
