const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: true
  },

  chargingType: {
    type: String,
    required: true
  },

  percentToCharge: {
    type: Number,
    required: true
  },

  energyRequired: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  profit: {
    type: Number,
    default: 0
  },

  expiresAt: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Booking", bookingSchema);
