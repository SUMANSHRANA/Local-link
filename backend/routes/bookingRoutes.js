const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Booking = require("../models/Booking");
const Cart = require("../models/Cart");
const Service = require("../models/Service");
const ServiceAgent = require("../models/ServiceAgent");
const User = require("../models/User");

// Get all bookings (admin)
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId")
      .populate("serviceProviderId", "name")
      .populate("customerId", "fullName emailAddress");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get customer's bookings
router.get("/my-orders", auth(["customer"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("serviceId")
      .populate("serviceCategoryId", "categoryName")
      .populate("serviceProviderId", "name")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get service agent's bookings
router.get("/agent", auth(["serviceAgent"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ serviceProviderId: req.user.id })
      .populate("serviceId")
      .populate("serviceCategoryId", "categoryName")
      .populate("customerId", "fullName emailAddress contact")
      .sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Checkout — auto-assign service agent algorithm (same logic as original)
router.post("/checkout", auth(["customer"]), async (req, res) => {
  try {
    const { selectedDates, selectedTimeSlots, paymentMethod } = req.body;
    // selectedDates: { serviceId: "YYYY-MM-DD" }
    // selectedTimeSlots: { serviceId: "HH:MM" }

    const fetchedUser = await User.findById(req.user.id);
    if (!fetchedUser) return res.status(404).json({ message: "User not found" });

    const serviceIds = Object.keys(selectedDates);

    // Gather all unique service categories
    const serviceCategoryMap = {};
    for (const sid of serviceIds) {
      const svc = await Service.findById(sid).populate("type");
      const catId = svc.type._id.toString();
      if (!serviceCategoryMap[catId]) serviceCategoryMap[catId] = [];
      serviceCategoryMap[catId].push(sid);
    }

    const unavailableCategories = [];

    for (const [catId, svcIds] of Object.entries(serviceCategoryMap)) {
      const agents = await ServiceAgent.find({ serviceCategory: catId });
      let assigned = false;

      for (const agent of agents) {
        let agentAvailable = true;

        for (const sid of svcIds) {
          const existing = await Booking.findOne({
            serviceCategoryId: catId,
            serviceProviderId: agent._id,
            date: selectedDates[sid],
            timeSlot: selectedTimeSlots[sid],
          });
          if (existing) { agentAvailable = false; break; }
        }

        if (agentAvailable) {
          for (const sid of svcIds) {
            const svc = await Service.findById(sid);
            await new Booking({
              serviceId: sid,
              serviceCategoryId: catId,
              serviceProviderId: agent._id,
              customerId: req.user.id,
              date: selectedDates[sid],
              timeSlot: selectedTimeSlots[sid],
              customerName: fetchedUser.fullName,
              customerEmail: fetchedUser.emailAddress,
              customerPhone: fetchedUser.contact,
              status: "Yet To Serve",
              price: svc.price,
              paymentMethod: paymentMethod || "Cash on Service",
              paymentStatus: paymentMethod === "Cash on Service" ? "Pending" : "Paid",
            }).save();
          }
          assigned = true;
          break;
        }
      }

      if (!assigned) unavailableCategories.push(catId);
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    if (unavailableCategories.length > 0) {
      return res.status(207).json({
        message: "Some services could not be booked",
        unavailableCategories,
      });
    }

    res.json({ message: "All services booked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.put("/cancel/:id", auth(["customer"]), async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customerId: req.user.id },
      { status: "Cancelled", serviceProviderId: null },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status (service agent)
router.put("/:id/status", auth(["serviceAgent"]), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
