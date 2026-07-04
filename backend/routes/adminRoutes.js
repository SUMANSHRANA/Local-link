const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Booking = require("../models/Booking");
const City = require("../models/City");
const Service = require("../models/Service");

// Dashboard stats
router.get("/dashboard", auth(["admin"]), async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [orderStats] = await Booking.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $group: { _id: null, count: { $sum: 1 }, totalRevenue: { $sum: "$price" } } },
    ]);

    const customerCount = await User.countDocuments({ role: "customer", createdAt: { $gte: lastMonth } });
    const cityCount = await City.countDocuments();

    const recentUsers = await User.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("-password");

    const topServicesRaw = await Booking.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $group: { _id: "$serviceId", totalBookings: { $sum: 1 }, totalRevenue: { $sum: "$price" } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 3 },
    ]);

    const topServices = await Promise.all(
      topServicesRaw.map(async (s) => {
        const svc = await Service.findById(s._id).lean();
        return { serviceName: svc?.name || "Unknown", totalBookings: s.totalBookings, totalRevenue: s.totalRevenue };
      })
    );

    res.json({
      orderCount: orderStats?.count || 0,
      totalRevenue: orderStats?.totalRevenue || 0,
      customerCount,
      cityCount,
      recentUsers,
      topServices,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
