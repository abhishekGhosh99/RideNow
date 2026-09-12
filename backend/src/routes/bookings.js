const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Customer routes
router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.get("/:id", protect, getBooking);

router.put("/:id", protect, updateBooking);

router.patch(
  "/:id/cancel",
  protect,
  cancelBooking
);

// Admin routes
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllBookings
);

module.exports = router;