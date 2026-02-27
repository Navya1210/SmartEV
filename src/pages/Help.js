function Help() {
  return (
    <div className="container mt-5" style={{ maxWidth: '900px' }}>
      
      <h2 className="mb-5 text-center" style={{ 
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        ❓ Help & Support
      </h2>

      <div className="card p-4 mb-4">
        <div className="d-flex align-items-start">
          <div style={{ 
            fontSize: '2.5rem', 
            marginRight: '20px',
            minWidth: '60px',
            textAlign: 'center'
          }}>
            📍
          </div>
          <div>
            <h5 style={{ color: '#00c6ff', marginBottom: '12px' }}>How to Book a Slot?</h5>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '0' }}>
              <strong>Step 1:</strong> Enable location access to find nearby stations<br/>
              <strong>Step 2:</strong> Select a charging station from the map<br/>
              <strong>Step 3:</strong> Check availability and choose charging type<br/>
              <strong>Step 4:</strong> Enter battery percentage and proceed to payment<br/>
              <strong>Step 5:</strong> Enter OTP to confirm your booking
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="d-flex align-items-start">
          <div style={{ 
            fontSize: '2.5rem', 
            marginRight: '20px',
            minWidth: '60px',
            textAlign: 'center'
          }}>
            ❌
          </div>
          <div>
            <h5 style={{ color: '#00c6ff', marginBottom: '12px' }}>How to Cancel Booking?</h5>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '0' }}>
              Go to <strong>My Bookings</strong> page → Find your booking → Click <strong>Cancel Booking</strong> button → Confirm cancellation. The slot will be released immediately and made available for other users.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="d-flex align-items-start">
          <div style={{ 
            fontSize: '2.5rem', 
            marginRight: '20px',
            minWidth: '60px',
            textAlign: 'center'
          }}>
            ⚡
          </div>
          <div>
            <h5 style={{ color: '#00c6ff', marginBottom: '12px' }}>Charging Types Explained</h5>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '0' }}>
              <strong>Normal Charging (₹12/kWh):</strong> Standard charging speed, ideal for overnight charging or when you have time.<br/>
              <strong>Fast Charging (₹18/kWh):</strong> Rapid charging for quick top-ups when you're in a hurry.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4" style={{ 
        background: 'linear-gradient(135deg, rgba(0, 198, 255, 0.15), rgba(0, 114, 255, 0.15))',
        border: '1px solid rgba(0, 198, 255, 0.3)'
      }}>
        <div className="d-flex align-items-start">
          <div style={{ 
            fontSize: '2.5rem', 
            marginRight: '20px',
            minWidth: '60px',
            textAlign: 'center'
          }}>
            📞
          </div>
          <div>
            <h5 style={{ color: '#00c6ff', marginBottom: '12px' }}>Need More Assistance?</h5>
            <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.7', marginBottom: '10px' }}>
              Our support team is here to help you 24/7. Reach out to us:
            </p>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
              <strong>📧 Email:</strong> support@smartev.com
            </p>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '0' }}>
              <strong>📞 Phone:</strong> +91 6383520464
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Help;
