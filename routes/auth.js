const router = require("express").Router();
const { validateUser } = require("../middlewares/ValidateUser");
const { validationResult } = require("express-validator");
const User = require("../models/userSchema");
const { generateOTP, transporter, generateOtpEmailTemplate } = require("../utils/mail");
const VerificationToken = require("../models/verificationToken"); // <- Uppercase
const jwt = require("jsonwebtoken");


// STEP 1 - Create user + send OTP
router.post("/signup", validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { name, email } = req.body;

    // Check if user exists already
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        // ✅ Case 1: User already verified → block signup
        return res.status(400).json({ error: "User with this email already exists" });
      } else {
        // ✅ Case 2: User exists but NOT verified → resend OTP

        // ✅ Update name if changed
        if (typeof name === "string" && name.trim() !== "" && name !== existingUser.name) {
          existingUser.name = name.trim();
          await existingUser.save();
        }

        await VerificationToken.deleteMany({ email }); // delete old OTPs

        const OTP = generateOTP();

        const verificationToken = new VerificationToken({
          email: existingUser.email,
          token: OTP,
        });
        await verificationToken.save();

  
        await transporter.sendMail({
  from: "farmguardhelp@gmail.com", // sender
  to: existingUser.email,                        // recipient
  subject: "Resend OTP for account verification",
  html: generateOtpEmailTemplate(OTP),
});


        return res.status(200).json({
          message: "User exists but not verified. New OTP sent to email.",
          email: existingUser.email,
        });
      }
    }

    // ✅ Case 3: New user signup
    const newUser = new User({ name: name.trim(), email, isVerified: false });
    await newUser.save();

    // Generate OTP
    const OTP = generateOTP();

    // Save OTP in verification token collection
        const verificationToken = new VerificationToken({
  email: newUser.email.toLowerCase(),
  token: OTP,
});
    await verificationToken.save();



    // Send OTP email
          await transporter.sendMail({
  from: "farmguardhelp@gmail.com", // sender
  to: newUser.email,                        // recipient
  subject: "Resend OTP for account verification",
  html: generateOtpEmailTemplate(OTP),
});

    // Respond with ID for next step
    res.status(200).json({
      message: "OTP sent to your email",
      email: newUser.email,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//step 2 /signup/verify
router.post("/signup/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Invalid request. Email and OTP required." });
    }

    // ✅ Find OTP

    const tokenRecord = await VerificationToken.findOne({ email });
    if (!tokenRecord) {
      return res.status(400).json({ message: "No OTP record found. Please request again." });
    }

    // ✅ Validate OTP
    if (tokenRecord.token !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // ✅ Prevent double verification
    if (user.isVerified) {
      
      return res.status(400).json({ message: "User already verified. Please login." });
    }

    // ✅ Generate Tokens
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } // e.g. 15m
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } // e.g. 7d
    );

    // ✅ Verify user + save refresh token
    user.isVerified = true;
    user.refreshToken = refreshToken;
    await user.save();

    // ✅ Delete OTP after success
    await VerificationToken.findByIdAndDelete(tokenRecord._id);

    res.status(200).json({
      message: "User verified & logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
      token: accessToken, // 👈 keep for frontend compatibility
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





module.exports = router;

   // ✅ fixed exports spelling

// STEP 1 - Signin (Send OTP)
router.post("/signin", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User with this email does not exist" });
    }

if (!user.isVerified) {
  return res.status(400).json({ error: "User not verified. Please Sign Up first." });
}


    // ✅ Generate OTP
    const OTP = generateOTP();

    // ✅ Delete any old OTP for this user
    // await VerificationToken.deleteMany({ email });

    // ✅ Save new OTP
    const verificationToken = new VerificationToken({
      email,
      token: OTP,
    });
    await verificationToken.save();

    // ✅ Send OTP email
           await transporter.sendMail({
  from: "farmguardhelp@gmail.com", // sender
  to: user.email,                        // recipient
  subject: "Resend OTP for account verification",
  html: generateOtpEmailTemplate(OTP),
});

    res.status(200).json({
      message: "OTP sent to your email for signin",
      email,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STEP 2 - Verify OTP (Signin)
router.post("/signin/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required." });
    }

    const emailLower = email.toLowerCase();

    // Find OTP record
    const tokenRecord = await VerificationToken.findOne({ email: emailLower });
    if (!tokenRecord) {
      return res.status(400).json({ error: "OTP expired or not found. Please request again." });
    }

    if (tokenRecord.token !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Find user
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ error: "User not found. Please sign up first." });
    }

    // Verify user
    user.isVerified = true;
    await user.save();

    // Delete OTP record
    await VerificationToken.findByIdAndDelete(tokenRecord._id);

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    // verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // check if user still exists and refresh token matches
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // issue new access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } // e.g., 15m
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});
