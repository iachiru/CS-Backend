const express = require("express");
const {
  signUp,
  logIn,
  getMe,
  editUser,
  getAllUsers,
} = require("../controllers/kitchenUserController");
const {
  getOneKitchen,
  getKitchensByUser,
  postNewKitchen,
  editKitchen,
  deleteKitchen,
} = require("../controllers/kitchenController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", signUp);
router.post("/login", logIn);
router.get("/profile", protect, getMe);
router.put("/:userId", protect, editUser);

router.get("/:userId/kitchen/:kitchenId", getOneKitchen);
router.get("/:userId/kitchen", getKitchensByUser);
router.post("/:userId/kitchen", protect, postNewKitchen);
router.put("/:userId/kitchen/:kitchenId", protect, editKitchen);
router.delete("/:userId/kitchen/:kitchenId", protect, deleteKitchen);

module.exports = router;
