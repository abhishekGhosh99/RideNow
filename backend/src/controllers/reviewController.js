const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  const {
    carId,
    bookingId,
    rating,
    ratings,
    comment,
  } = req.body;

  // Validate required fields
  if (!carId || !bookingId || !rating) {
    return res.status(400).json({
      success: false,
      message: "Car, booking and rating are required",
    });
  }

  // Check car exists
  const car = await Car.findById(carId);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: "Car not found",
    });
  }

  // Find booking belonging to current user
  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user.id,
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  // Make sure booking belongs to this car
  if (booking.car.toString() !== carId) {
    return res.status(400).json({
      success: false,
      message: "This booking does not belong to this car",
    });
  }

  // Only completed bookings can be reviewed
  if (booking.status !== "completed") {
    return res.status(400).json({
      success: false,
      message: "You can only review a completed booking",
    });
  }

  // Prevent duplicate review
  const existingReview = await Review.findOne({
    user: req.user.id,
    booking: bookingId,
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this booking",
    });
  }

  const review = await Review.create({
    user: req.user.id,
    car: carId,
    booking: bookingId,
    rating,
    ratings,
    comment,
    isVerifiedBooking: true,
  });

  const populatedReview = await Review.findById(review._id)
    .populate("user", "name")
    .populate("car", "name brand model");

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: populatedReview,
  });
});

// @desc    Get reviews for a car
// @route   GET /api/reviews/car/:carId
// @access  Public
exports.getCarReviews = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  const reviews = await Review.find({
    car: carId,
    isApproved: true,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews
      : 0;

  res.status(200).json({
    success: true,
    data: {
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    },
  });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res) => {
  const { rating, ratings, comment } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  // Only review owner can update
  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this review",
    });
  }

  if (rating !== undefined) {
    review.rating = rating;
  }

  if (ratings !== undefined) {
    review.ratings = ratings;
  }

  if (comment !== undefined) {
    review.comment = comment;
  }

  await review.save();

  const updatedReview = await Review.findById(review._id)
    .populate("user", "name")
    .populate("car", "name brand model");

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: updatedReview,
  });
});

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  // Only review owner can delete
  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this review",
    });
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});