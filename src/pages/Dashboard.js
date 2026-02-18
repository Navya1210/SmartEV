import React, { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    API.get("/stations")
      .then(res => setStations(res.data));
  }, []);

  const bookSlot = async (stationId) => {
    await API.post("/bookings", {
      userId: "demoUserId",
      stationId
    });
    alert("Slot Booked!");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        ⚡ Charging Stations
      </h2>

      <div className="row">
        {stations.map(station => (
          <div className="col-md-4 mb-4" key={station._id}>
            <div className="card p-3 shadow-lg">
              <h5>{station.name}</h5>
              <p>📍 {station.location}</p>
              <p>⚡ Voltage: {station.voltage}V</p>
              <p>🔌 Available Slots: {station.availableSlots}</p>

              <button
                className="btn btn-primary w-100"
                onClick={() => bookSlot(station._id)}>
                Book Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
