const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {

    const { name, email, phone, password, carType, carModel } = req.body;

    // 🔎 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔋 Assign full range based on car model
    let fullRange = 0;

    const rangeData = {
      "Punch EV": 421,
      "Nexon EV": 465,
      "Tiago EV": 315,
      "XUV400": 456,
      "ZS EV": 461,
      "Kona Electric": 452,
      "EV6": 528
    };

    fullRange = rangeData[carModel] || 300; // default range

    const user = new User({
      name,
      email,
      phone,
      password,
      carType,
      carModel,
      fullRange
    });

    await user.save();

    res.json({
      message: "User Registered Successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login Successful",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
