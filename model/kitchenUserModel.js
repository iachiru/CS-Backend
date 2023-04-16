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
    kitchen: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Kitchen",
    },
    host: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KitchenUser", kitchenUserSchema);
