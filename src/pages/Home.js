import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section className="hero-section d-flex align-items-center justify-content-center text-center">
        <div>
          <h1 className="hero-title">
            Power Your Journey with SmartEV ⚡
          </h1>

          <p className="hero-subtitle">
            Locate Nearby Charging Stations & Book Instantly
          </p>

          <Link to="/stations" className="btn btn-glow mt-4">
            Find Charging Stations →
          </Link>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section-dark text-center py-5">
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Why Choose SmartEV?</h2>
          <p className="mt-3 px-5" style={{ fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '900px', margin: '0 auto', color: 'rgba(255,255,255,0.9)' }}>
            SmartEV provides real-time charging station availability,
            secure OTP booking, and location-based discovery to ensure
            seamless EV charging experiences across urban and highway areas.
          </p>
          
          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card p-4" style={{ height: '100%' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚡</div>
                <h5 style={{ marginBottom: '15px' }}>Real-Time Availability</h5>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Check live slot availability at all charging stations</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card p-4" style={{ height: '100%' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
                <h5 style={{ marginBottom: '15px' }}>Secure Booking</h5>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>OTP-based verification for safe transactions</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card p-4" style={{ height: '100%' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📍</div>
                <h5 style={{ marginBottom: '15px' }}>Smart Navigation</h5>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Find nearest stations with route optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-light text-center py-5">
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '50px' }}>How It Works</h2>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div style={{ 
                background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(0, 114, 255, 0.3)'
              }}>
                📍
              </div>
              <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>Enable Location</h5>
              <p style={{ color: '#555', lineHeight: '1.6' }}>Allow location access to find chargers near you instantly.</p>
            </div>

            <div className="col-md-4 mb-4">
              <div style={{ 
                background: 'linear-gradient(135deg, #00b09b, #96c93d)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(0, 176, 155, 0.3)'
              }}>
                ⚡
              </div>
              <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>Select Station</h5>
              <p style={{ color: '#555', lineHeight: '1.6' }}>Check live slot availability and choose your charger.</p>
            </div>

            <div className="col-md-4 mb-4">
              <div style={{ 
                background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(255, 65, 108, 0.3)'
              }}>
                🔐
              </div>
              <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>Confirm with OTP</h5>
              <p style={{ color: '#555', lineHeight: '1.6' }}>Secure booking with instant OTP verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section-dark text-center py-5">
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Contact Us</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
            <strong>📧 Email:</strong> support@smartev.com
          </p>
          <p style={{ fontSize: '1.1rem' }}>
            <strong>📞 Phone:</strong> +91 6383520464
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer text-center py-4">
        <p style={{ margin: 0, fontSize: '0.95rem' }}>
          © 2026 SmartEV Charging System | All Rights Reserved
        </p>
      </footer>

    </div>
  );
}

export default Home;
