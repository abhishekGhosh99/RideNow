const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");

router.get("/", (req, res) => {
  res.json({ success: true, message: "API is working" });
});

router.use("/auth", authRoutes);
// router.use("/cars", require("./carRoutes"));
// router.use("/bookings", require("./bookingRoutes"));

module.exports = router;
