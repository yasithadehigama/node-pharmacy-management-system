const express = require("express");
const router = express.Router();
const verifyAccesstoken = require("../middleware/auth");
const {
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  softDeleteCustomer,
} = require("../controllers/customerController");

router.route("/").get(verifyAccesstoken, getCustomer);
router.route("/").post(verifyAccesstoken, addCustomer);
router.route("/").put(verifyAccesstoken, updateCustomer);
router.route("/").delete(verifyAccesstoken, deleteCustomer);
router.route("/soft-delete").put(verifyAccesstoken, softDeleteCustomer);

module.exports = router;
