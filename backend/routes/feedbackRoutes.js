const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Feedback = require("../models/Feedback");
const nodemailer = require("nodemailer");

router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "fullName");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth(["customer"]), async (req, res) => {
  try {
    const { serviceCategoryId, feedback, rating } = req.body;
    const fb = new Feedback({ userId: req.user.id, serviceCategoryId, feedback, rating });
    await fb.save();
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `VeeServe Contact: ${name}`,
      text: message,
    });
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
