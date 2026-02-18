import React, { useEffect, useState } from "react";
import API from "../api";

function Bookings() {

  const [bookings, setBookings] = useState([]);

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
    }
  };

  const cancelBooking = async (bookingId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {

      await API.delete(`/api/bookings/cancel/${bookingId}`);

      alert("Booking cancelled successfully ❌");

      loadBookings();

    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4 text-white">
        My Bookings
      </h2>

      {bookings.length === 0 && (
        <p className="text-center text-white">
          No bookings found.
        </p>
      )}

      {bookings.map((booking) => (
        <div key={booking._id} className="card p-4 mb-3 shadow-lg">

          <h5>Station: {booking.stationId?.name}</h5>

          <p>
            <strong>Charging Type:</strong> {booking.chargingType}
          </p>

          <p>
            <strong>Energy:</strong> {booking.energyRequired.toFixed(2)} kWh
          </p>

          <p>
            <strong>Total Amount:</strong> ₹{booking.totalAmount.toFixed(2)}
          </p>

          <p>
            <strong>Booking Time:</strong>{" "}
            {new Date(booking.createdAt).toLocaleString()}
          </p>

          <button
            className="btn btn-danger mt-3"
            onClick={() => cancelBooking(booking._id)}
          >
            Cancel Booking
          </button>

        </div>
      ))}

    </div>
  );
}

export default Bookings;
