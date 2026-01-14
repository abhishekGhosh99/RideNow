const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["economy", "standard", "luxury", "suv", "sedan"],
      required: true,
    },
    // Pricing structure
    pricing: {
      perDay: {
        type: Number,
        required: true,
      },
      perWeek: Number,
      perMonth: Number,
      // Discounts for plan holders
      discounts: {
        basic: { type: Number, default: 0 }, // percentage
        standard: { type: Number, default: 5 },
        premium: { type: Number, default: 10 },
      },
    },
    // Car specifications
    specifications: {
      seats: Number,
      transmission: {
        type: String,
        enum: ["automatic", "manual"],
      },
      fuelType: {
        type: String,
        enum: ["petrol", "diesel", "electric", "hybrid"],
      },
      mileage: String,
      engineCapacity: String,
      features: [String], // AC, GPS, Bluetooth, etc.
    },
    // Images
    images: [
      {
        url: String,
        alt: String,
        isPrimary: Boolean,
      },
    ],
    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
    location: {
      city: String,
      branch: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    // Ratings
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // Maintenance
    lastServiceDate: Date,
    nextServiceDate: Date,
    totalKilometers: Number,
    // Booking restrictions
    minimumRentalDays: {
      type: Number,
      default: 1,
    },
    maximumRentalDays: {
      type: Number,
      default: 30,
    },
    // Featured car
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
carSchema.index({ name: "text", brand: "text", model: "text" });
carSchema.index({ category: 1, "pricing.perDay": 1 });

module.exports = mongoose.model("Car", carSchema);
