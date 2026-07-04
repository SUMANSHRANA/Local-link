const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const ServiceAgent = require("../models/ServiceAgent");
const Booking = require("../models/Booking");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/agents");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "agent-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 2000000 } });

// GET all agents (admin)
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const agents = await ServiceAgent.find().populate("serviceCategory", "categoryName");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET agents by service category (public — for service detail page)
router.get("/by-category/:categoryId", async (req, res) => {
  try {
    const agents = await ServiceAgent.find({
      serviceCategory: req.params.categoryId,
      isApproved: true,
    })
      .populate("serviceCategory", "categoryName")
      .select("name email contact address experience image serviceCategory isAvailable");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create agent (admin)
router.post("/", auth(["admin"]), upload.single("image"), async (req, res) => {
  try {
    const { name, serviceCategory, userName, password, email, contact, address, experience } = req.body;
    const agent = new ServiceAgent({
      name, serviceCategory, userName, password,
      email, contact, address, experience,
      image: req.file ? `/uploads/agents/${req.file.filename}` : null,
      isApproved: true,
      isAvailable: true,
    });
    await agent.save();
    const populated = await agent.populate("serviceCategory", "categoryName");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update agent details (admin)
router.put("/:id", auth(["admin"]), upload.single("image"), async (req, res) => {
  try {
    const { name, serviceCategory, email, contact, address, experience, isAvailable } = req.body;
    const update = { name, serviceCategory, email, contact, address, experience };
    if (isAvailable !== undefined) update.isAvailable = isAvailable === "true" || isAvailable === true;
    if (req.file) update.image = `/uploads/agents/${req.file.filename}`;
    const agent = await ServiceAgent.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("serviceCategory", "categoryName");
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT approve agent (admin)
router.put("/:id/approve", auth(["admin"]), async (req, res) => {
  try {
    const agent = await ServiceAgent.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isAvailable: true },
      { new: true }
    );
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE agent (admin)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    const bookingsCount = await Booking.countDocuments({ serviceProviderId: req.params.id });
    if (bookingsCount > 0) {
      return res.status(400).json({ message: "Cannot delete agent with existing bookings" });
    }
    await ServiceAgent.findByIdAndDelete(req.params.id);
    res.json({ message: "Service agent deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
