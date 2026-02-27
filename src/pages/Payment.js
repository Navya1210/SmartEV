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
    return (
      <div className="container mt-5">
        <div className="card p-5 text-center">
          <h3>⚠️ No station selected</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>Please go back and select a charging station.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/stations')}>
            Go to Stations
          </button>
        </div>
      </div>
    );
  }

  const fullRange = user?.fullRange || 400;
  const batteryCapacity = fullRange / 10; 
  const energyRequired = (batteryPercent / 100) * batteryCapacity;
  const normalRate = 12;
  const fastRate = 18;
  const rate = chargingType === "fast" ? fastRate : normalRate;
  const totalAmount = (energyRequired * rate).toFixed(2);

  const handlePayment = async () => {
    try {
      const otpRes = await API.post("/api/bookings/send-otp");
      setGeneratedOtp(String(otpRes.data.otp));
      alert("✅ Payment Successful!\n\nOTP has been sent to confirm your booking.");
    } catch (err) {
      alert("❌ Payment failed. Please try again.");
    }
  };

  const confirmBooking = async () => {

    if (otpInput.trim() !== generatedOtp) {
      alert("❌ Invalid OTP. Please try again.");
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
      alert(err.response?.data?.message || "❌ Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>

      {!success ? (
        <div className="card p-4 shadow-lg">

          <h3 className="text-center mb-4" style={{ 
            fontSize: '2rem',
            background: 'linear-gradient(135deg, #8d9eff, #6573c3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            💳 Payment Details
          </h3>

          <div style={{ 
            background: 'rgba(101, 115, 195, 0.15)', 
            padding: '20px', 
            borderRadius: '15px',
            marginBottom: '25px',
            border: '1px solid rgba(101, 115, 195, 0.3)'
          }}>
            <p style={{ marginBottom: '10px', fontSize: '1.05rem', color: '#e8eaf6' }}>
              <strong>🏭 Station:</strong> {station.name}
            </p>
            <p style={{ marginBottom: '10px', fontSize: '1.05rem', color: '#e8eaf6' }}>
              <strong>📍 Distance:</strong> {routeInfo?.distanceKm} km
            </p>
            <p style={{ marginBottom: '0', fontSize: '1.05rem', color: '#e8eaf6' }}>
              <strong>⏱️ ETA:</strong> {routeInfo?.etaMinutes} mins
            </p>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: '600', fontSize: '1.05rem' }}>
              ⚡ Select Charging Type
            </label>
            <select
              className="form-control"
              value={chargingType}
              onChange={(e) => setChargingType(e.target.value)}
            >
              <option value="normal">Normal Charging (₹12/kWh)</option>
              <option value="fast">Fast Charging (₹18/kWh)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ fontWeight: '600', fontSize: '1.05rem' }}>
              🔋 Battery % To Charge
            </label>
            <input
              type="number"
              min="10"
              max="100"
              className="form-control"
              value={batteryPercent}
              onChange={(e) => setBatteryPercent(Number(e.target.value))}
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', marginTop: '5px', display: 'block' }}>
              Adjust the percentage you want to charge (10-100%)
            </small>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(102, 187, 106, 0.15))',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}>
            <h5 style={{ color: '#81c784', marginBottom: '10px' }}>
              ⚡ Energy Required: {energyRequired.toFixed(2)} kWh
            </h5>
            <h4 style={{ color: '#8d9eff', marginBottom: '0' }}>
              💵 Total Amount: ₹{totalAmount}
            </h4>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handlePayment}
            style={{ fontSize: '1.1rem', padding: '14px' }}
          >
            💳 Pay Now
          </button>

          {generatedOtp && (
            <div className="otp-section mt-4">
              <h5 className="text-center mb-3" style={{ color: '#8d9eff' }}>
                🔐 Enter OTP to Confirm
              </h5>
              <input
                className="form-control mb-3"
                placeholder="Enter 4-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '3px' }}
              />
              <button
                className="btn btn-success w-100"
                onClick={confirmBooking}
                disabled={loading}
                style={{ fontSize: '1.1rem', padding: '14px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  '✅ Confirm Booking'
                )}
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
          <h2 className="mt-4" style={{ 
            color: '#66bb6a',
            fontSize: '2.5rem',
            fontWeight: '800'
          }}>
            ✅ Booking Confirmed!
          </h2>
          <p style={{ color: 'rgba(232, 234, 246, 0.8)', marginTop: '15px', fontSize: '1.1rem' }}>
            Your slot is reserved for 1 hour
          </p>
          <p style={{ color: 'rgba(197, 202, 233, 0.6)', fontSize: '0.95rem' }}>
            Redirecting to your bookings...
          </p>
        </div>
      )}

    </div>
  );
}

export default Payment;
