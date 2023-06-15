const mongoose = require("mongoose");

const kitchenSchema = mongoose.Schema(
  {
    images: {
      type: [String],
      default: `https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg`,
    },
    ref: { type: String },
    price: { type: String, required: true },
    description: { type: String, required: true },
    kitchenType: { type: String, required: true },
    address: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KitchenUser",
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Kitchen", kitchenSchema);
