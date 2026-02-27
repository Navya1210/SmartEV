const express = require("express");
const router = express.Router();
const Station = require("../models/Station");
const Booking = require("../models/Booking"); // 🔥 ADDED


router.get("/", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =========================
   HARDWARE STATUS ROUTE
========================= */

router.get("/hardware-status/:stationId", async (req, res) => {
  try {

    const station = await Station.findById(req.params.stationId);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const activeBooking = await Booking.findOne({
      stationId: station._id
    }).sort({ createdAt: -1 });

    res.json({
      slotAvailable: station.availableSlots > 0,
      charging: !!activeBooking
    });

  } catch (err) {
    console.log("HARDWARE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
