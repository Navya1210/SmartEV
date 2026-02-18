import React from "react";
import "./SuccessAnimation.css";

function SuccessAnimation({ onClose }) {
  return (
    <div className="success-overlay">
      <div className="success-box">
        <div className="checkmark-circle">
          <div className="background"></div>
          <div className="checkmark draw"></div>
        </div>
        <h4>Booking Confirmed</h4>
      </div>
    </div>
  );
}

export default SuccessAnimation;
