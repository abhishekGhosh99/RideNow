const Plan = require("../models/Plan");
const User = require("../models/User");

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort("sortOrder");

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching plans",
      error: error.message,
    });
  }
};

// @desc    Subscribe to plan
// @route   POST /api/plans/subscribe
// @access  Private
exports.subscribeToPlan = async (req, res) => {
  try {
    const { planId, duration } = req.body; // duration: 'monthly' or 'yearly'

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Calculate expiry date
    const expiryDate = new Date();
    if (duration === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        activePlan: planId,
        planExpiryDate: expiryDate,
      },
      { new: true }
    ).populate("activePlan");

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to plan",
      data: {
        user,
        expiryDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error subscribing to plan",
      error: error.message,
    });
  }
};
