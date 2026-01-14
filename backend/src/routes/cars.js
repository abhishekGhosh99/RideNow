const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  checkAvailability,
} = require("../controllers/carController");

// Public routes
router.get("/", getCars);
router.get("/:id", getCar);
router.post("/:id/check-availability", checkAvailability);

// Protected routes (Admin only)
router.post("/", protect, authorize("admin"), createCar);
router.put("/:id", protect, authorize("admin"), updateCar);
router.delete("/:id", protect, authorize("admin"), deleteCar);

module.exports = router;
