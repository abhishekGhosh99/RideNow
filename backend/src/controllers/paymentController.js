const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
// const { sendPaymentReceipt } = require("../utils/emailService");

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("car");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Verify user owns this booking
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Check if already paid
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking is already paid",
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.pricing.totalAmount * 100), // Convert to cents
      currency: "inr",
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        carName: booking.car.name,
      },
      description: `Car Rental: ${booking.car.name} - ${booking.bookingNumber}`,
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: booking.pricing.totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating payment intent",
      error: error.message,
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId, paymentMethodId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      paymentMethod: "card",
      stripePaymentIntentId: paymentIntentId,
      stripePaymentMethodId: paymentMethodId,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      status: "succeeded",
      cardDetails: {
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expiryMonth: paymentMethod.card.exp_month,
        expiryYear: paymentMethod.card.exp_year,
      },
      invoiceNumber: `INV${Date.now()}`,
    });

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "paid",
        status: "confirmed",
        payment: payment._id,
      },
      { new: true }
    ).populate(["car", "user"]);

    // Send confirmation email
    // await sendPaymentReceipt(booking, payment);

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: {
        payment,
        booking,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error confirming payment",
      error: error.message,
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("booking")
      .populate("user");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Check authorization
    if (
      payment.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment",
      error: error.message,
    });
  }
};

// @desc    Request refund
// @route   POST /api/payments/:id/refund
// @access  Private
exports.requestRefund = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Check authorization
    if (payment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Check if already refunded
    if (payment.status === "refunded") {
      return res.status(400).json({
        success: false,
        message: "Payment is already refunded",
      });
    }

    const { amount, reason } = req.body;
    const refundAmount = amount || payment.amount;

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100),
    });

    // Update payment record
    payment.status = "refunded";
    payment.refund = {
      amount: refundAmount,
      reason,
      refundedAt: new Date(),
      refundId: refund.id,
    };
    await payment.save();

    // Update booking
    await Booking.findByIdAndUpdate(payment.booking._id, {
      paymentStatus: "refunded",
    });

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing refund",
      error: error.message,
    });
  }
};
