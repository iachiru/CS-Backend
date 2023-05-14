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

/* const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `kitchenPics`,
    },
  }),
}).single("image"); */

router.get("/kitchens", getAllKitchens);
router.get("/:kitchenRef", getKitchen);
//router.post("/kitchen-pics", protect, cloudinaryUploader, uploadPics);

module.exports = router;
