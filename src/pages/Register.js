import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

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

  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      await API.post("/api/auth/register", form);
      alert("Registered Successfully ✅");
      navigate("/");
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>

      <div className="text-center mb-4">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800',
          background: 'linear-gradient(135deg, #8d9eff, #6573c3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ⚡ Create Account
        </h1>
        <p style={{ color: 'rgba(197, 202, 233, 0.8)', marginTop: '10px' }}>
          Join SmartEV and start charging smarter
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-4">

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: '600' }}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: '600' }}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: '600' }}>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: '600' }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: '600' }}>Car Brand</label>
          <select
            name="carType"
            className="form-control"
            onChange={handleChange}
            required
          >
            <option value="">Select Car Brand</option>
            <option value="Tata">Tata</option>
            <option value="Mahindra">Mahindra</option>
            <option value="Hyundai">Hyundai</option>
            <option value="MG">MG</option>
            <option value="Kia">Kia</option>
          </select>
        </div>

        {form.carType && (
          <div className="mb-4">
            <label className="form-label" style={{ fontWeight: '600' }}>Car Model</label>
            <select
              name="carModel"
              className="form-control"
              onChange={handleChange}
              required
            >
              <option value="">Select Car Model</option>
              {carModels[form.carType].map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="btn btn-success w-100 mb-3" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>

        <div className="text-center">
          <span style={{ color: 'rgba(197, 202, 233, 0.7)' }}>
            Already have an account?
          </span>
          <br />
          <Link to="/" style={{ 
            color: '#8d9eff', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Login Here →
          </Link>
        </div>

      </form>

    </div>
  );
}

export default Register;
