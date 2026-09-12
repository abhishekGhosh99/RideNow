const Car = require("../models/Car");
const Booking = require("../models/Booking");

// @desc    Get all cars with filters
// @route   GET /api/cars
// @access  Public
exports.getCars = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      transmission,
      fuelType,
      seats,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    let query = { isAvailable: true };

    if (category) query.category = category;
    if (transmission) query["specifications.transmission"] = transmission;
    if (fuelType) query["specifications.fuelType"] = fuelType;
    if (seats) query["specifications.seats"] = parseInt(seats);

    if (minPrice || maxPrice) {
      query["pricing.perDay"] = {};
      if (minPrice) query["pricing.perDay"].$gte = parseFloat(minPrice);
      if (maxPrice) query["pricing.perDay"].$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case "price_asc":
        sortOption = { "pricing.perDay": 1 };
        break;
      case "price_desc":
        sortOption = { "pricing.perDay": -1 };
        break;
      case "rating":
        sortOption = { averageRating: -1 };
        break;
      case "popular":
        sortOption = { totalReviews: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cars = await Car.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Car.countDocuments(query);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cars",
      error: error.message,
    });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching car",
      error: error.message,
    });
  }
};

// @desc    Check car availability
// @route   POST /api/cars/:id/check-availability
// @access  Public
// exports.checkAvailability = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.body;
//     const carId = req.params.id;

//     // Check if car exists
//     const car = await Car.findById(carId);
//     if (!car) {
//       return res.status(404).json({
//         success: false,
//         message: "Car not found",
//       });
//     }

//     // Check for overlapping bookings
//     const overlappingBookings = await Booking.find({
//       car: carId,
//       status: { $in: ["confirmed", "ongoing"] },
//       $or: [
//         {
//           startDate: { $lte: new Date(endDate) },
//           endDate: { $gte: new Date(startDate) },
//         },
//       ],
//     });

//     const isAvailable = overlappingBookings.length === 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         isAvailable,
//         car: car.name,
//         requestedPeriod: {
//           startDate,
//           endDate,
//         },
//         conflictingBookings: overlappingBookings.length,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error checking availability",
//       error: error.message,
//     });
//   }
// };

// @desc    Search available cars by destination and dates
// @route   GET /api/cars/search
// @access  Public
exports.searchAvailableCars = async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.query;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Destination, start date, and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Find cars that are already booked during the requested period
    const conflictingBookings = await Booking.find({
      status: { $in: ["confirmed", "ongoing"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    }).select("car");

    const bookedCarIds = conflictingBookings.map((booking) => booking.car);

    // Find cars in the requested destination that are not booked
    const cars = await Car.find({
      isAvailable: true,

      "location.city": {
        $regex: `^${destination.trim()}$`,
        $options: "i",
      },

      _id: {
        $nin: bookedCarIds,
      },
    }).sort({ isFeatured: -1, averageRating: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
      search: {
        destination,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching available cars",
      error: error.message,
    });
  }
};

// @desc    Create new car (Admin)
// @route   POST /api/cars
// @access  Private/Admin
exports.createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      message: "Car created successfully",
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating car",
      error: error.message,
    });
  }
};

// @desc    Update car (Admin)
// @route   PUT /api/cars/:id
// @access  Private/Admin
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating car",
      error: error.message,
    });
  }
};

// @desc    Delete car (Admin)
// @route   DELETE /api/cars/:id
// @access  Private/Admin
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting car",
      error: error.message,
    });
  }
};
