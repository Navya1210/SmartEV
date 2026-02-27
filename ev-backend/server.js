const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/smart_ev_charging")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stations", require("./routes/stationRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

// Auto-cleanup expired bookings and restore slots
const Booking = require("./models/Booking");
const Station = require("./models/Station");

setInterval(async () => {
  try {
    const expiredBookings = await Booking.find({
      expiresAt: { $lte: new Date() }
    });

    for (const booking of expiredBookings) {
      const station = await Station.findById(booking.stationId);
      if (station) {
        station.availableSlots += 1;
        await station.save();
      }
      await Booking.findByIdAndDelete(booking._id);
      console.log(`🔄 Auto-cancelled expired booking: ${booking._id}`);
    }
  } catch (err) {
    console.log("Auto-cleanup error:", err);
  }
}, 60000);

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
