import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section className="hero-section d-flex align-items-center justify-content-center text-center">
        <div>
          <h1 className="hero-title text-white">
            Power Your Journey with SmartEV 
          </h1>

          <p className="hero-subtitle text-white">
            Locate Nearby Charging Stations & Book Instantly
          </p>

          <Link to="/stations" className="btn btn-glow mt-4">
            Find Charging Stations
          </Link>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section-dark text-center py-5">
        <h2>Why Choose SmartEV?</h2>
        <p className="mt-3 px-5">
          SmartEV provides real-time charging station availability,
          secure OTP booking, and location-based discovery to ensure
          seamless EV charging experiences across urban and highway areas.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-light text-center py-5">
        <h2>How It Works</h2>

        <div className="container mt-4">
          <div className="row">
            <div className="col-md-4">
              <h5>📍 Enable Location</h5>
              <p>Allow location access to find chargers near you.</p>
            </div>

            <div className="col-md-4">
              <h5>⚡ Select Station</h5>
              <p>Check live slot availability and choose your charger.</p>
            </div>

            <div className="col-md-4">
              <h5>🔐 Confirm with OTP</h5>
              <p>Secure booking with instant OTP verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section-dark text-center py-5">
        <h2>Contact Us</h2>
        <p>Email: support@smartev.com</p>
        <p>Phone: +91 6383520464</p>
      </section>

      {/* FOOTER */}
      <footer className="footer text-center py-3">
        © 2026 SmartEV Charging System | All Rights Reserved
      </footer>

    </div>
  );
}

export default Home;
