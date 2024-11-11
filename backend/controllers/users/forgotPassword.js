const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User } = require("../../models");
const nodemailer = require("nodemailer");

// Setup transporter for email
const transporter = nodemailer.createTransport({
  service: "Zoho",
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "zakiymluthfi@zohomail.com",
    pass: "amatsukaze-chan", // Replace with your actual password or app password
  },
});

// Function to send email
const sendResetTokenEmail = async (email, token) => {
  const mailOptions = {
    from: "zakiymluthfi@zohomail.com",
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Here is your token:\n\n${token}\n\nThis token is valid for 3 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send reset email");
  }
};

// Controller function to request password reset
const requestResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email, is_deleted: false } });
    if (!user) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now

    // Update user with reset token and expiration
    user.reset_password_token = resetToken;
    user.reset_password_expires = expires;
    await user.save();

    // Send reset token to user's email
    await sendResetTokenEmail(email, resetToken);

    res.json({ message: "Reset token sent to your email." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Controller function to reset password
const verifyResetToken = async (req, res) => {
  const { email, resetToken } = req.body;
  try {
    console.log("Received request to verify token:", email, resetToken);

    const user = await User.findOne({ where: { email, is_deleted: false } });
    if (!user) {
      console.log("User not found or inactive");
      return res.status(404).json({ message: "User not found or inactive" });
    }

    console.log("User found:", user);

    if (
      user.reset_password_token !== resetToken ||
      new Date() > new Date(user.reset_password_expires)
    ) {
      console.log("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("Token is valid");
    res.json({ valid: true });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email, is_deleted: false } });
    if (!user) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.reset_password_token = null; // Clear reset token
    user.reset_password_expires = null; // Clear expiration
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  requestResetPassword,
  resetPassword,
  verifyResetToken,
};
