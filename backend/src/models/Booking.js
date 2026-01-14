const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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
    // Booking details
    bookingNumber: {
      type: String,
      unique: true,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      days: Number,
      hours: Number,
    },
    // Pickup and return
    pickupLocation: {
      address: String,
      city: String,
      zipCode: String,
      time: String,
    },
    returnLocation: {
      address: String,
      city: String,
      zipCode: String,
      time: String,
    },
    // Pricing breakdown
    pricing: {
      basePrice: Number,
      planDiscount: Number,
      promoDiscount: Number,
      insurance: Number,
      extraCharges: Number, // GPS, child seat, etc.
      taxes: Number,
      totalAmount: Number,
    },
    // Applied plan
    appliedPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    promoCode: String,
    // Additional services
    extras: [
      {
        name: String,
        price: Number,
      },
    ],
    // Driver info
    driverInfo: {
      licenseNumber: String,
      isMainDriver: Boolean,
      additionalDrivers: [
        {
          name: String,
          licenseNumber: String,
        },
      ],
    },
    // Status tracking
    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    // Cancellation
    cancellation: {
      cancelledAt: Date,
      cancelledBy: {
        type: String,
        enum: ["user", "admin"],
      },
      reason: String,
      refundAmount: Number,
    },
    // Notes
    specialRequests: String,
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

// Generate unique booking number
bookingSchema.pre("save", async function (next) {
  if (!this.bookingNumber) {
    this.bookingNumber = "RN" + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
