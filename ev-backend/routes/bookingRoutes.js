const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Station = require("../models/Station");
const User = require("../models/User");

/* =========================
   SEND OTP
========================= */

router.post("/send-otp", async (req, res) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);

    console.log("Generated OTP:", otp);

    res.status(200).json({
      success: true,
      otp
    });

  } catch (err) {
    console.log("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to generate OTP" });
  }
});


/* =========================
   VERIFY OTP & CREATE BOOKING
========================= */

router.post("/verify-otp", async (req, res) => {
  try {

    const {
      stationId,
      userId,
      percentToCharge,
      chargingType
    } = req.body;

    if (!stationId || !userId || !percentToCharge || !chargingType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const station = await Station.findById(stationId);
    const user = await User.findById(userId);

    if (!station)
      return res.status(404).json({ message: "Station not found" });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (station.availableSlots <= 0)
      return res.status(400).json({ message: "No slots available" });

    const PRICE_PER_KWH = chargingType === "fast" ? 18 : 12;
    const PROFIT_PER_KWH = chargingType === "fast" ? 6 : 3;

    const batteryCapacity = user.fullRange / 10;
    const energyRequired = (percentToCharge / 100) * batteryCapacity;

    const totalAmount = energyRequired * PRICE_PER_KWH;
    const profit = energyRequired * PROFIT_PER_KWH;

    station.availableSlots -= 1;
    await station.save();

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const booking = new Booking({
      userId: user._id,
      stationId: station._id,
      chargingType,
      percentToCharge,
      energyRequired,
      totalAmount,
      profit,
      expiresAt
    });

    await booking.save();

    res.json({
      message: "Booking Confirmed",
      booking
    });

  } catch (err) {
    console.log("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


/* =========================
   GET USER BOOKINGS
========================= */

router.get("/user/:userId", async (req, res) => {
  try {

    const bookings = await Booking.find({
      userId: req.params.userId
    })
      .populate("stationId")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


/* =========================
   CANCEL BOOKING
========================= */

router.delete("/cancel/:bookingId", async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    const station = await Station.findById(booking.stationId);

    if (station) {
      station.availableSlots += 1;
      await station.save();
    }

    await Booking.findByIdAndDelete(req.params.bookingId);

    res.json({ message: "Booking Cancelled Successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
