const User = require("../models/User");

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("activePlan")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "First name, last name and email are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether another account already uses this email
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already in use",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.firstName = firstName.trim();
    user.lastName = lastName.trim();
    user.email = normalizedEmail;

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate("activePlan")
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
