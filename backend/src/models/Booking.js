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
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      licenseNumber: {
        type: String,
        required: true,
        trim: true,
      },

      isMainDriver: {
        type: Boolean,
        default: true,
      },

      additionalDrivers: [
        {
          name: {
            type: String,
            trim: true,
          },

          email: {
            type: String,
            trim: true,
            lowercase: true,
          },

          phone: {
            type: String,
            trim: true,
          },

          licenseNumber: {
            type: String,
            trim: true,
          },
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
  },
);

// Generate unique booking number
bookingSchema.pre("save", function () {
  if (!this.bookingNumber) {
    this.bookingNumber = `RN${Date.now()}${Math.floor(
      1000 + Math.random() * 9000,
    )}`;
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
