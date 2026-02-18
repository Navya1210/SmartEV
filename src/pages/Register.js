import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    carType: "",
    carModel: ""
  });

  const carModels = {
    Tata: ["Punch EV", "Nexon EV", "Tiago EV", "Tigor EV", "Altroz EV"],
    Mahindra: ["XUV400", "BE.05", "eVerito", "Bolero EV", "Thar EV"],
    Hyundai: ["Kona Electric", "Ioniq 5", "Ioniq 6", "Creta EV", "Venue EV"],
    MG: ["ZS EV", "Comet EV", "MG4 EV", "Marvel R", "Cyberster"],
    Kia: ["EV6", "EV9", "Soul EV", "Niro EV", "Seltos EV"]
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/api/auth/register", form);


    alert("Registered Successfully ✅");
    navigate("/");
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center text-white mb-4">Register</h2>

      <form onSubmit={handleSubmit} className="card p-4">

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
        />

        {/* Car Type */}
        <select
          name="carType"
          className="form-control mb-3"
          onChange={handleChange}
        >
          <option value="">Select Car Brand</option>
          <option value="Tata">Tata</option>
          <option value="Mahindra">Mahindra</option>
          <option value="Hyundai">Hyundai</option>
          <option value="MG">MG</option>
          <option value="Kia">Kia</option>
        </select>

        {/* Car Model */}
        {form.carType && (
          <select
            name="carModel"
            className="form-control mb-3"
            onChange={handleChange}
          >
            <option value="">Select Car Model</option>
            {carModels[form.carType].map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        )}

        <button className="btn btn-success">
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;
