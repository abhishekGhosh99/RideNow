const mongoose = require("mongoose");


// const paymentRoutes = require("./payments");

// router.use("/payments", paymentRoutes);

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "wallet"],
      required: true,
    },
    // Stripe/Payment gateway info
    stripePaymentIntentId: String,
    stripePaymentMethodId: String,
    // Transaction details
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    // Card details (last 4 digits only)
    cardDetails: {
      brand: String,
      last4: String,
      expiryMonth: Number,
      expiryYear: Number,
    },
    // Refund info
    refund: {
      amount: Number,
      reason: String,
      refundedAt: Date,
      refundId: String,
    },
    // Receipt
    receiptUrl: String,
    invoiceNumber: String,
    // Metadata
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
