const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createReview,
  getCarReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", protect, createReview);
router.get("/car/:carId", getCarReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
