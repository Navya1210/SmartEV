import React, { useEffect, useState } from "react";
import API from "../api";

function Bookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await API.get(`/api/bookings/user/${user._id}`);
      setBookings(res.data);
    } catch (err) {
      console.log("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await API.delete(`/api/bookings/cancel/${bookingId}`);
      alert("✅ Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      alert("❌ Failed to cancel booking");
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '900px' }}>

      <h2 className="text-center mb-5" style={{ 
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        📝 My Bookings
      </h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.7)' }}>Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card p-5 text-center">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
          <h4 style={{ marginBottom: '15px' }}>No bookings found</h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '25px' }}>
            You haven't made any bookings yet. Start by finding a charging station!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/stations'}
          >
            Find Charging Stations
          </button>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="card p-4 mb-4 shadow-lg">

            <div className="d-flex justify-content-between align-items-start mb-3">
              <h4 style={{ 
                color: '#00c6ff',
                marginBottom: '0',
                fontSize: '1.5rem'
              }}>
                🏭 {booking.stationId?.name}
              </h4>
              <span style={{
                background: booking.chargingType === 'fast' 
                  ? 'linear-gradient(135deg, #ff416c, #ff4b2b)'
                  : 'linear-gradient(135deg, #00b09b, #96c93d)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                {booking.chargingType === 'fast' ? '⚡ Fast' : '🔋 Normal'}
              </span>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <div style={{ 
                  background: 'rgba(101, 115, 195, 0.15)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '1px solid rgba(101, 115, 195, 0.3)'
                }}>
                  <p style={{ marginBottom: '8px', fontSize: '0.95rem', color: '#e8eaf6' }}>
                    <strong>⚡ Energy:</strong> {booking.energyRequired.toFixed(2)} kWh
                  </p>
                  <p style={{ marginBottom: '0', fontSize: '0.95rem', color: '#e8eaf6' }}>
                    <strong>💵 Amount:</strong> ₹{booking.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div style={{ 
                  background: 'rgba(150, 201, 61, 0.1)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '1px solid rgba(150, 201, 61, 0.2)'
                }}>
                  <p style={{ marginBottom: '8px', fontSize: '0.95rem', color: '#e8eaf6' }}>
                    <strong>📅 Booked:</strong><br/>
                    {new Date(booking.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                  <p style={{ marginBottom: '0', fontSize: '0.95rem', color: '#e8eaf6' }}>
                    <strong>⏰ Expires:</strong><br/>
                    {new Date(booking.expiresAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255, 193, 7, 0.15)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '0', color: '#ffc107', fontWeight: '600' }}>
                ⏱️ Slot valid for 1 hour | Auto-cancels if not used
              </p>
            </div>

            <button
              className="btn btn-danger mt-2 w-100"
              onClick={() => cancelBooking(booking._id)}
              style={{ fontSize: '1rem', padding: '12px' }}
            >
              ❌ Cancel Booking
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default Bookings;
