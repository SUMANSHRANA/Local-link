const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ServiceCategory = require("../models/ServiceCategory");
const SubCategory = require("../models/SubCategory");

// Get all active categories
router.get("/", async (req, res) => {
  try {
    const cats = await ServiceCategory.find({ isActive: true });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all categories (admin)
router.get("/all", auth(["admin"]), async (req, res) => {
  try {
    const cats = await ServiceCategory.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get subcategories by category
router.get("/:categoryId/subcategories", async (req, res) => {
  try {
    const subs = await SubCategory.find({ categoryId: req.params.categoryId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add subcategory (admin)
router.post("/subcategory", auth(["admin"]), async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    const sub = new SubCategory({ title, categoryId });
    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search categories
router.get("/search/:query", async (req, res) => {
  try {
    const cats = await ServiceCategory.find({
      categoryName: { $regex: req.params.query, $options: "i" },
      isActive: true,
    });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
