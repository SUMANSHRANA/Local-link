const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const City = require("../models/City");

router.get("/", async (req, res) => {
  try {
    res.json(await City.find({ isActive: true }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all", auth(["admin"]), async (req, res) => {
  try {
    res.json(await City.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: "City deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
