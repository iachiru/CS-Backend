const express = require("express");
const router = express.Router();
const {
  getKitchen,
  getAllKitchens,
  uploadPics,
} = require("../controllers/kitchenController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `kitchenPics`,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  }),
}).array("images");

router.get("/kitchens", getAllKitchens);
router.get("/:kitchenRef", getKitchen);
router.put(
  "/:userId/kitchen-pics/:kitchenId",
  protect,
  cloudinaryUploader,
  uploadPics
);

module.exports = router;
