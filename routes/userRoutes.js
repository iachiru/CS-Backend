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

router.get("/", getAllUsers);
router.post("/register", signUp);
router.post("/login", logIn);
router.get("/profile", protect, getMe);
router.route("/:userId").put(protect, editUser).delete(protect, deleteUser);
router.post("/:userId/avatar", protect, cloudinaryUploader, uploadUserPics);

router
  .route("/:userId/kitchen")
  .get(getKitchensByUser)
  .post(protect, postNewKitchen);

router
  .route("/:userId/kitchen/:kitchenId")
  .get(getOneKitchen)
  .put(protect, editKitchen)
  .delete(protect, deleteKitchen);

module.exports = router;
