const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["basic", "standard", "premium"],
    },
    displayName: {
      type: String,
      required: true,
    },
    description: String,
    // Pricing
    price: {
      monthly: Number,
      yearly: Number,
    },
    // Benefits
    features: [
      {
        name: String,
        description: String,
        included: Boolean,
      },
    ],
    // Discounts on rentals
    rentalDiscount: {
      type: Number,
      default: 0, // percentage
    },
    // Limits
    benefits: {
      freeBookingChanges: Number,
      prioritySupport: Boolean,
      freeUpgrades: Number,
      earlyAccess: Boolean,
      luxuryCarAccess: Boolean,
    },
    // Plan validity
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plan", planSchema);
