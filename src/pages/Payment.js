import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import "./payment.css";

function Payment() {

  const navigate = useNavigate();
  const location = useLocation();

  const { station, routeInfo } = location.state || {};

  const [chargingType, setChargingType] = useState("normal");
  const [batteryPercent, setBatteryPercent] = useState(40);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  if (!station) {
    return <h3 className="text-center mt-5">No station selected</h3>;
  }

  /* =========================
     PRICE CALCULATION (MATCHES BACKEND)
  ========================== */

  const fullRange = user?.fullRange || 400;

  const batteryCapacity = fullRange / 10; 
  const energyRequired = (batteryPercent / 100) * batteryCapacity;

  const normalRate = 12;
  const fastRate = 18;

  const rate = chargingType === "fast" ? fastRate : normalRate;

  const totalAmount = (energyRequired * rate).toFixed(2);

  /* =========================
     PAYMENT SIMULATION
  ========================== */

  const handlePayment = async () => {
    try {
      const otpRes = await API.post("/api/bookings/send-otp");
      setGeneratedOtp(String(otpRes.data.otp));
      alert("Payment Successful 💳\nOTP sent to confirm booking.");
    } catch (err) {
      alert("Payment failed ❌");
    }
  };

  /* =========================
     CONFIRM BOOKING
  ========================== */

  const confirmBooking = async () => {

    if (otpInput.trim() !== generatedOtp) {
      alert("Invalid OTP ❌");
      return;
    }

    try {

      setLoading(true);

      await API.post("/api/bookings/verify-otp", {
        stationId: station._id,
        userId: user._id,
        percentToCharge: Number(batteryPercent),
        chargingType: chargingType
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/bookings");
      }, 2500);

    } catch (err) {
      console.log("Booking Error:", err.response?.data);
      alert(err.response?.data?.message || "Booking failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================== */

  return (
    <div className="container mt-5">

      {!success ? (
        <div className="card p-4 shadow-lg">

          <h3 className="text-center mb-4">Payment Details</h3>

          <p><strong>Station:</strong> {station.name}</p>
          <p><strong>Distance:</strong> {routeInfo?.distanceKm} km</p>
          <p><strong>ETA:</strong> {routeInfo?.etaMinutes} mins</p>

          <hr />

          <label>Select Charging Type</label>

          <select
            className="form-control mb-3"
            value={chargingType}
            onChange={(e) => setChargingType(e.target.value)}
          >
            <option value="normal">Normal Charging (₹12/kWh)</option>
            <option value="fast">Fast Charging (₹18/kWh)</option>
          </select>

          <label>Battery % To Charge</label>

          <input
            type="number"
            min="10"
            max="100"
            className="form-control mb-3"
            value={batteryPercent}
            onChange={(e) => setBatteryPercent(Number(e.target.value))}
          />

          <h4 className="text-success">
            Energy Required: {energyRequired.toFixed(2)} kWh
          </h4>

          <h4 className="text-primary">
            Total Amount: ₹{totalAmount}
          </h4>

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={handlePayment}
          >
            Pay Now
          </button>

          {generatedOtp && (
            <div className="mt-4 text-center">
              <h5>Enter OTP</h5>
              <input
                className="form-control mb-2"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <button
                className="btn btn-success w-100"
                onClick={confirmBooking}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center success-animation">
          <div className="checkmark-circle">
            <div className="background"></div>
            <div className="checkmark draw"></div>
          </div>
          <h2 className="mt-3 text-success">Booking Confirmed!</h2>
        </div>
      )}

    </div>
  );
}

export default Payment;
