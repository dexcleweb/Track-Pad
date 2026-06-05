const { z } = require("zod");
const { createAndSendOtp, verifyOtp } = require("../services/otp.service");
const { signToken } = require("../utils/jwt");

const sendOtpSchema = z.object({
  email: z.string().email(),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});

async function sendOtp(req, res, next) {
  try {
    const { email } = sendOtpSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();

    const result = await createAndSendOtp(normalizedEmail);

    res.json({
      message: result.message,
      emailSent: result.emailSent,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyOtpController(req, res, next) {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();

    const user = await verifyOtp(normalizedEmail, otp);
    const token = signToken(user);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
}

module.exports = {
  sendOtp,
  verifyOtpController,
  me,
};