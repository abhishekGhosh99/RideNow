const express = require("express");

const {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  requestRefund,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/create-intent", protect, createPaymentIntent);

router.post("/confirm", protect, confirmPayment);

router.get("/:id", protect, getPayment);

router.post("/:id/refund", protect, requestRefund);

module.exports = router;