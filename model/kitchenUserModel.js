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
    image: {
      type: String,
      default:
        "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png",
    },
    address: {
      type: String,
      default: "Please provide an address",
    },
    companyName: {
      type: String,
      default: "Please provide your company's name",
    },
    companyAddress: {
      type: String,
      default: "Please provide your company's address",
    },
    companyType: {
      type: String,
      default: "Please provide the type of company",
    },
    kitchen: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Kitchen",
    },
    host: { type: Boolean },
    hostType: {
      type: String,
      default: "Please select:",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KitchenUser", kitchenUserSchema);
