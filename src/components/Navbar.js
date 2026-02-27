import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const goToAbout = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById("about");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const goToContact = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById("contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top px-4">

      <span
        className="navbar-brand fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        ⚡ SmartEV
      </span>

      <div className="ms-auto d-flex gap-4 align-items-center">

        <span
          className="nav-link text-white"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Home
        </span>

        <span
          className="nav-link text-white"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/stations")}
        >
          Stations
        </span>

        <Link className="nav-link text-white" to="/bookings">
          Bookings
        </Link>

        <span
          className="nav-link text-white"
          style={{ cursor: "pointer" }}
          onClick={goToAbout}
        >
          About
        </span>

        <span
          className="nav-link text-white"
          style={{ cursor: "pointer" }}
          onClick={goToContact}
        >
          Contact
        </span>

        <Link className="nav-link text-white" to="/help">
          Help
        </Link>

        <button
          className="btn btn-danger btn-sm"
          onClick={handleLogout}
          style={{ padding: '6px 18px' }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
