const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    // Generate token
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error registering user",
    //   error: error.message,
    // });
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error logging in",
    //   error: error.message,
    // });
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("activePlan")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error fetching user",
    //   error: error.message,
    // });
    next(error);
  }
};

// Additional auth methods: forgotPassword, resetPassword, updatePassword, etc.


//token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOTg1N2ZhYmQ5ZDE5YWFkZjBkN2RkZSIsImlhdCI6MTc4ODM2ODg5MSwiZXhwIjoxNzkwOTYwODkxfQ.ySm59dABHK30pxMnKM3XW7lDiRAAKIPBMC5aNtNOVc4"