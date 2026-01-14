const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  createBooking,
  getMyBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

// Protected routes
router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/:id", getBooking);
router.put("/:id", updateBooking);
router.post("/:id/cancel", cancelBooking);

// Admin routes
router.get("/", authorize("admin"), getAllBookings);

module.exports = router;
