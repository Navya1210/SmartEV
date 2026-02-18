function Help() {
  return (
    <div className="container mt-5 text-white">
      <h2 className="mb-4 text-center">Help & Support</h2>

      <div className="card p-4 mb-3">
        <h5>How to Book a Slot?</h5>
        <p>
          Enable location → Select station → Check availability →
          Enter OTP → Booking confirmed.
        </p>
      </div>

      <div className="card p-4 mb-3">
        <h5>How to Cancel Booking?</h5>
        <p>
          Go to My Bookings → Click Cancel → Slot will be released.
        </p>
      </div>

      <div className="card p-4">
        <h5>Need Assistance?</h5>
        <p>Email: support@smartev.com</p>
        <p>Phone: +91 6383520464</p>
      </div>
    </div>
  );
}

export default Help;
