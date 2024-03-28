const express = require("express");
const router = express.Router();
const verifyAccesstoken = require("../middleware/auth");
const {
  getMedicines,
  addMedicines,
  updateMedicines,
  deleteMedicines,
  softDeleteMedicines,
} = require("../controllers/medicationsController");

router.route("/").get(verifyAccesstoken, getMedicines);
router.route("/").post(verifyAccesstoken, addMedicines);
router.route("/").put(verifyAccesstoken, updateMedicines);
router.route("/").delete(verifyAccesstoken, deleteMedicines);
router.route("/soft-delete").put(verifyAccesstoken, softDeleteMedicines);

module.exports = router;
