const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: String,
  location: String,
  voltage: Number,
  current: Number,
  temperature: Number,
  totalSlots: Number,
  availableSlots: Number,
  latitude: Number,
  longitude: Number,

});

module.exports = mongoose.model("Station", stationSchema);
