import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Login({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/api/auth/login", form);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsLoggedIn(true);
      navigate("/");

    } catch (err) {
      setError("Invalid Email or Password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>

      <div className="text-center mb-4">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '800',
          background: 'linear-gradient(135deg, #8d9eff, #6573c3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ⚡ SmartEV
        </h1>
        <p style={{ color: 'rgba(197, 202, 233, 0.8)', marginTop: '10px' }}>
          Welcome back! Login to continue
        </p>
      </div>

      <form onSubmit={handleLogin} className="card p-4 shadow-lg">

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: '600' }}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label" style={{ fontWeight: '600' }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-100 mb-3" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <div className="text-center">
          <span style={{ color: 'rgba(197, 202, 233, 0.7)' }}>
            Don't have an account?
          </span>
          <br />
          <Link to="/register" style={{ 
            color: '#8d9eff', 
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Register Here →
          </Link>
        </div>

      </form>

    </div>
  );
}

export default Login;
