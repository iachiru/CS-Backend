const mongoose = require("mongoose");

const kitchenUserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userImage: {
      type: String,
    },
    address: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    companyType: {
      type: String,
    },
    kitchen: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Kitchen",
    },
    host: { type: Boolean },
    hostType: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KitchenUser", kitchenUserSchema);
