const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Car = require("../models/Car");
const Plan = require("../models/Plan");

const asyncHandler = require("../utils/asyncHandler");
const {
  validateDateRange,
  calculateRentalDays,
  datesOverlap,
} = require("../utils/dateHelpers");
const { calculatePrice } = require("../utils/pricingCalculator");

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const checkBookingAvailability = async (
  carId,
  startDate,
  endDate,
  excludeBookingId = null,
) => {
  const bookingsQuery = {
    car: carId,

    // These bookings currently occupy the vehicle.
    status: {
      $in: ["confirmed", "ongoing"],
    },
  };

  if (excludeBookingId) {
    bookingsQuery._id = {
      $ne: excludeBookingId,
    };
  }

  const existingBookings = await Booking.find(bookingsQuery).select(
    "startDate endDate status",
  );

  return !existingBookings.some((booking) =>
    datesOverlap(booking.startDate, booking.endDate, startDate, endDate),
  );
};

// --------------------------------------------------
// Create booking
// --------------------------------------------------

exports.createBooking = asyncHandler(async (req, res) => {
  const generateBookingNumber = () => {
    return `RN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const {
    carId,
    startDate,
    endDate,
    pickupLocation,
    returnLocation,
    appliedPlan,
    promoCode,
    extras = [],
    driverInfo,
    specialRequests,
  } = req.body;

  // -----------------------------------------------
  // Basic validation
  // -----------------------------------------------

  if (!carId) {
    return res.status(400).json({
      success: false,
      message: "Car ID is required",
    });
  }

  if (!isValidObjectId(carId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid car ID",
    });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Start date and end date are required",
    });
  }

  // -----------------------------------------------
  // Validate dates
  // -----------------------------------------------

  let start;
  let end;

  try {
    ({ start, end } = validateDateRange(startDate, endDate));
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  const days = calculateRentalDays(start, end);

  // -----------------------------------------------
  // Find car
  // -----------------------------------------------

  const car = await Car.findById(carId);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: "Car not found",
    });
  }

  if (!car.isAvailable) {
    return res.status(400).json({
      success: false,
      message: "This car is currently unavailable",
    });
  }

  // -----------------------------------------------
  // Rental duration restrictions
  // -----------------------------------------------

  if (days < car.minimumRentalDays) {
    return res.status(400).json({
      success: false,
      message: `Minimum rental period is ${car.minimumRentalDays} day${
        car.minimumRentalDays === 1 ? "" : "s"
      }`,
    });
  }

  if (days > car.maximumRentalDays) {
    return res.status(400).json({
      success: false,
      message: `Maximum rental period is ${car.maximumRentalDays} days`,
    });
  }

  // -----------------------------------------------
  // Check availability
  // -----------------------------------------------

  const isAvailable = await checkBookingAvailability(carId, start, end);

  if (!isAvailable) {
    return res.status(409).json({
      success: false,
      message: "This car is already booked for the selected dates",
    });
  }

  // -----------------------------------------------
  // Validate plan
  // -----------------------------------------------

  let plan = null;

  if (appliedPlan) {
    if (!isValidObjectId(appliedPlan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    plan = await Plan.findOne({
      _id: appliedPlan,
      isActive: true,
    });

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Selected plan is unavailable",
      });
    }
  }

  // -----------------------------------------------
  // Calculate pricing
  // -----------------------------------------------

  const pricing = calculatePrice({
    car,
    startDate: start,
    endDate: end,
    plan,
    extras,
    promoCode,
  });

  // -----------------------------------------------
  // Create booking
  // -----------------------------------------------

  const booking = await Booking.create({
    user: req.user._id,

    car: car._id,

    bookingNumber: generateBookingNumber(),

    startDate: start,
    endDate: end,

    duration: {
      days: pricing.days,
      hours: Math.ceil((end - start) / (1000 * 60 * 60)),
    },

    pickupLocation:
      typeof pickupLocation === "string"
        ? { address: pickupLocation.trim() }
        : pickupLocation,
    returnLocation:
      typeof returnLocation === "string"
        ? { address: returnLocation.trim() }
        : returnLocation,

    pricing: {
      basePrice: pricing.basePrice,
      planDiscount: pricing.planDiscount,
      promoDiscount: pricing.promoDiscount,
      insurance: pricing.insurance,
      extraCharges: pricing.extraCharges,
      taxes: pricing.taxes,
      totalAmount: pricing.totalAmount,
    },

    appliedPlan: plan?._id || null,

    promoCode: promoCode || undefined,

    extras,

    driverInfo,

    specialRequests,

    status: "pending",

    paymentStatus: "pending",
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("car")
    .populate("appliedPlan", "name displayName");

  return res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: populatedBooking,
  });
});

// --------------------------------------------------
// Get current user's bookings
// --------------------------------------------------

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })
    .populate(
      "car",
      "name brand model year category pricing images location averageRating",
    )
    .populate("appliedPlan", "name displayName")
    .sort({
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// --------------------------------------------------
// Get single booking
// --------------------------------------------------

exports.getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking ID",
    });
  }

  const booking = await Booking.findOne({
    _id: id,
    user: req.user._id,
  })
    .populate("car")
    .populate("appliedPlan")
    .populate("payment");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: booking,
  });
});

// --------------------------------------------------
// Update pending booking
// --------------------------------------------------

exports.updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking ID",
    });
  }

  const booking = await Booking.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  if (booking.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Only pending bookings can be modified",
    });
  }

  const allowedFields = [
    "pickupLocation",
    "returnLocation",
    "driverInfo",
    "specialRequests",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      booking[field] = req.body[field];
    }
  });

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate("car")
    .populate("appliedPlan");

  return res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: updatedBooking,
  });
});

// --------------------------------------------------
// Cancel booking
// --------------------------------------------------

exports.cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking ID",
    });
  }

  const booking = await Booking.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  if (["completed", "cancelled"].includes(booking.status)) {
    return res.status(400).json({
      success: false,
      message: "This booking cannot be cancelled",
    });
  }

  booking.status = "cancelled";

  booking.cancellation = {
    cancelledAt: new Date(),
    cancelledBy: "user",
    reason: reason || "Cancelled by customer",
    refundAmount: 0,
  };

  await booking.save();

  return res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});

// --------------------------------------------------
// Get all bookings - Admin
// --------------------------------------------------

exports.getAllBookings = asyncHandler(async (req, res) => {
  const { status, paymentStatus, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);

  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const skip = (pageNumber - 1) * limitNumber;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("user", "firstName lastName email")
      .populate("car", "name brand model category")
      .populate("payment", "amount status paymentMethod")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber),

    Booking.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    data: bookings,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
});
