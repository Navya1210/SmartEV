import React from "react";

function StationCard({ station }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-lg mb-4">
        <div className="card-body">
          <h5>{station.name}</h5>
          <p>📍 {station.location}</p>
          <p>⚡ Voltage: {station.voltage}V</p>
          <p>🔌 Available Slots: {station.availableSlots}</p>
          <button className="btn btn-primary w-100">
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}

export default StationCard;
