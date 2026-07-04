const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Service = require("../models/Service");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/services");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "service-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 2000000 } });

// Get all services (public)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { type: category } : {};
    const services = await Service.find(filter)
      .populate("type", "categoryName")
      .populate("subCategory", "title");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single service
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("type")
      .populate("subCategory");
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create service (admin)
router.post("/", auth(["admin"]), upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, type, subCategory } = req.body;
    const newService = new Service({
      name, description, price, type, subCategory,
      image: req.file ? `/uploads/services/${req.file.filename}` : null,
    });
    const saved = await newService.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update service (admin)
router.put("/:id", auth(["admin"]), upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, type, subCategory } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (req.file) {
      if (service.image) {
        const oldPath = path.join(__dirname, "..", service.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      service.image = `/uploads/services/${req.file.filename}`;
    }

    service.name = name;
    service.description = description;
    service.price = price;
    service.type = type;
    service.subCategory = subCategory;

    const updated = await service.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete service (admin)
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
