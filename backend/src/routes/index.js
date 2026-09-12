const express = require("express");

const router = express.Router();

const authRoutes = require("./auth");
const userRoutes = require("./users");
const carRoutes = require("./cars");
const bookingRoutes = require("./bookings");
const paymentRoutes = require("./payments");
const reviewRoutes = require("./reviews");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cars", carRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;
