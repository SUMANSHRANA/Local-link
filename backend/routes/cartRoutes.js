const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");

// Get cart
router.get("/", auth(["customer"]), async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.serviceId",
      model: "Service",
      populate: { path: "type", select: "categoryName" },
    });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
router.post("/add", auth(["customer"]), async (req, res) => {
  try {
    const { serviceId } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items.push({ serviceId });
      await cart.save();
    } else {
      cart = new Cart({ user: req.user.id, items: [{ serviceId }] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove from cart
router.delete("/remove/:serviceId", auth(["customer"]), async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const idx = cart.items.findIndex(
      (item) => item.serviceId.toString() === req.params.serviceId
    );
    if (idx > -1) cart.items.splice(idx, 1);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear cart
router.delete("/clear", auth(["customer"]), async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
