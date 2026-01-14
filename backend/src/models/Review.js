const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Detailed ratings
    ratings: {
      cleanliness: Number,
      comfort: Number,
      performance: Number,
      value: Number,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    // Review status
    isApproved: {
      type: Boolean,
      default: true,
    },
    isVerifiedBooking: {
      type: Boolean,
      default: true,
    },
    // Admin response
    adminResponse: {
      comment: String,
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// One review per booking
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
