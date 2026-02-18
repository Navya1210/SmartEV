import React, { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    voltage: "",
    current: "",
    temperature: "",
    totalSlots: "",
    availableSlots: ""
  });

  useEffect(() => {
    API.get("/stations")
      .then(res => setStations(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addStation = async (e) => {
    e.preventDefault();
    await API.post("/stations", form);
    alert("Station Added!");
  };

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>

      <div className="card p-3 mb-4">
        <h4>Add Station</h4>
        <form onSubmit={addStation}>
          <input name="name" placeholder="Name"
            className="form-control mb-2"
            onChange={handleChange} required />

          <input name="location" placeholder="Location"
            className="form-control mb-2"
            onChange={handleChange} required />

          <button className="btn btn-success">
            Add Station
          </button>
        </form>
      </div>

      <h4>All Stations</h4>

      {stations.map(s => (
        <div className="card p-3 mb-3 shadow" key={s._id}>
          <h5>{s.name}</h5>
          <p>Voltage: {s.voltage}</p>
          <p>Current: {s.current}</p>
          <p>Temperature: {s.temperature}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
