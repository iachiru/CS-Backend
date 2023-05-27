const express = require("express");
const {
  signUp,
  logIn,
  getMe,
  editUser,
  getAllUsers,
  deleteUser,
  uploadUserPics,
} = require("../controllers/kitchenUserController");
const {
  getOneKitchen,
  getKitchensByUser,
  postNewKitchen,
  editKitchen,
  deleteKitchen,
} = require("../controllers/kitchenController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `userPics`,
    },
  }),
}).single("image");

const cloudinaryUploaderKitchen = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `kitchenCreatePics`,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  }),
}).array("images");

router.get("/", getAllUsers);
router.post("/register", signUp);
router.post("/login", logIn);
router.get("/profile", protect, getMe);
router.put("/:userId", protect, editUser);
router.delete("/:userId", protect, deleteUser);
router.post("/:userId/avatar", protect, cloudinaryUploader, uploadUserPics);

router.get("/:userId/kitchen/:kitchenId", getOneKitchen);
router.get("/:userId/kitchen", getKitchensByUser);
router.post(
  "/:userId/kitchen",
  protect,
  cloudinaryUploaderKitchen,
  postNewKitchen
);
router.put("/:userId/kitchen/:kitchenId", protect, editKitchen);
router.delete("/:userId/kitchen/:kitchenId", protect, deleteKitchen);

module.exports = router;
