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
/* const cloudinary = require("../config/cloudinary"); */
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
router.put("/:userId", protect, editUser);
router.delete("/:userId", protect, deleteUser);
router.post("/avatar", cloudinaryUploader, uploadUserPics);
/*  const { image } = req.body;

  const uploadedImage = await cloudinary.uploader.upload(
    image,
    {
      upload_preset: "unsigned_upload",
      public_id: `avatar`,
      allowed_formats: ["png", "jpeg", "jpg"],
    },
    function (error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
    }
  );
  try {
    res.status(200).json(uploadedImage);
  } catch (error) {
    console.log(error);
  } */

router.get("/:userId/kitchen/:kitchenId", getOneKitchen);
router.get("/:userId/kitchen", getKitchensByUser);
router.post("/:userId/kitchen", protect, postNewKitchen);
router.put("/:userId/kitchen/:kitchenId", protect, editKitchen);
router.delete("/:userId/kitchen/:kitchenId", protect, deleteKitchen);

module.exports = router;
