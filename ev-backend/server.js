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


// 🔥 ADD THIS LINE
app.use("/api/auth", require("./routes/authRoutes"));


// Existing Routes
app.use("/api/stations", require("./routes/stationRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
