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
      const res = await API.post("/api/auth/login", form);


      // Save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update login state
      setIsLoggedIn(true);

      navigate("/");

    } catch (err) {
      setError("Invalid Email or Password ❌");
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center text-white mb-4">
        Login
      </h2>

      <form onSubmit={handleLogin} className="card p-4 shadow-lg">

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          className="form-control mb-3"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          className="form-control mb-3"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100 mb-3">
          Login
        </button>

        <div className="text-center">
          <span className="text-white">
            Don't have an account?
          </span>
          <br />
          <Link to="/register">
            Register Here
          </Link>
        </div>

      </form>

    </div>
  );
}

export default Login;
