const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const ServiceAgent = require("../models/ServiceAgent");
const City = require("../models/City");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

// Customer Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, emailAddress, password, contact } = req.body;
    const existing = await User.findOne({ emailAddress });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({ fullName, emailAddress, password, contact, role: "customer" });
    await newUser.save();

    const token = signToken({ id: newUser._id, role: "customer" });
    res.json({ token, user: { id: newUser._id, fullName: newUser.fullName, email: newUser.emailAddress, role: "customer" } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer Login
router.post("/login", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    const foundUser = await User.findOne({ emailAddress, role: "customer" });
    if (!foundUser) return res.status(400).json({ message: "User not found" });

    const match = await foundUser.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = signToken({ id: foundUser._id, role: "customer" });
    res.json({ token, user: { id: foundUser._id, fullName: foundUser.fullName, email: foundUser.emailAddress, role: "customer" } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    const foundUser = await User.findOne({ emailAddress, role: "admin" });
    if (!foundUser) return res.status(400).json({ message: "Admin not found" });

    const match = await foundUser.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = signToken({ id: foundUser._id, role: "admin" });
    res.json({ token, user: { id: foundUser._id, fullName: foundUser.fullName, email: foundUser.emailAddress, role: "admin" } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Service Agent Login
router.post("/agent/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const agent = await ServiceAgent.findOne({ userName }).populate("serviceCategory");
    if (!agent) return res.status(400).json({ message: "Agent not found" });

    const match = await agent.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    if (agent.isApproved === false) {
      return res.status(403).json({ message: "Your application is still pending admin approval." });
    }

    const token = signToken({ id: agent._id, role: "serviceAgent" });
    res.json({ token, agent: { id: agent._id, name: agent.name, userName: agent.userName, serviceCategory: agent.serviceCategory, role: "serviceAgent" } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Service Provider Self-Registration (pending admin approval)
router.post("/agent/register", async (req, res) => {
  try {
    const { name, userName, password, serviceCategory, email, contact, experience } = req.body;
    if (!name || !userName || !password || !serviceCategory) {
      return res.status(400).json({ message: "Name, username, password and service category are required" });
    }
    const existing = await ServiceAgent.findOne({ userName });
    if (existing) return res.status(400).json({ message: "Username already taken" });

    if (!email) return res.status(400).json({ message: "Email is required" });

    const agent = new ServiceAgent({
      name, userName, password, serviceCategory, email, contact, experience,
      isApproved: false,
      isAvailable: false,
    });
    await agent.save();

    res.status(201).json({ message: "Application submitted! Our team will review and approve your account soon." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register with address
router.post("/register-with-address", async (req, res) => {
  try {
    const { fullName, emailAddress, password, contact, address, cityId, pin } = req.body;
    const existing = await User.findOne({ emailAddress });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    let fullAddress = address;
    if (cityId) {
      const city = await City.findById(cityId);
      if (city) fullAddress = `${address}, ${city.cityName}, ${pin}`;
    }

    const newUser = new User({ fullName, emailAddress, password, contact, address: fullAddress, role: "customer" });
    await newUser.save();

    const token = signToken({ id: newUser._id, role: "customer" });
    res.json({ token, user: { id: newUser._id, fullName: newUser.fullName, email: newUser.emailAddress, role: "customer" } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { emailAddress } = req.body;
    const foundUser = await User.findOne({ emailAddress });
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    foundUser.resetPasswordToken = token;
    foundUser.resetPasswordExpires = Date.now() + 3600000;
    await foundUser.save();

    await getTransporter().sendMail({
      to: emailAddress,
      subject: "Local Link Password Reset",
      text: `Reset your password: http://localhost:3000/reset-password/${token}`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset email. Please check EMAIL_USER/EMAIL_PASS in backend/.env" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const foundUser = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!foundUser) return res.status(400).json({ message: "Invalid or expired token" });

    foundUser.password = req.body.password;
    foundUser.resetPasswordToken = undefined;
    foundUser.resetPasswordExpires = undefined;
    await foundUser.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
