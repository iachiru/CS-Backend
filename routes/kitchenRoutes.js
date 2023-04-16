const express = require("express");
const router = express.Router();
const {
  getKitchen,
  getAllKitchens,
} = require("../controllers/kitchenController");

router.get("/kitchens", getAllKitchens);
router.get("/:kitchenRef", getKitchen);

module.exports = router;
