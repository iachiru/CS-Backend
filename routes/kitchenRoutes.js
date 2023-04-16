/* const express = require("express");
const {
  getOneKitchen,
  getKitchensByUser,
  postNewKitchen,
  editKitchen,
  deleteKitchen,
} = require("../controllers/kitchenController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:userId/kitchen/:kitchenId", getOneKitchen);
router.get("/:userId/kitchen", getKitchensByUser);
router.post("/:userId/kitchen", protect, postNewKitchen);
router.put("/:userId/kitchen/:kitchenId", protect, editKitchen);
router.delete("/:userId/kitchen/:kitchenId", protect, deleteKitchen);

module.exports = router;
 */
const express = require("express");
const router = express.Router();
const {
  getKitchen,
  getAllKitchens,
} = require("../controllers/kitchenController");

router.get("/", getAllKitchens);
router.get("/:kitchenRef", getKitchen);

module.exports = router;
