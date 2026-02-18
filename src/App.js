import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CustomerMap from "./pages/CustomerMap";
import Help from "./pages/Help";
import Bookings from "./pages/Bookings";
import Payment from "./pages/Payment";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <Router>

      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}

      <Routes>

        {!isLoggedIn && (
          <>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {isLoggedIn && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/stations" element={<CustomerMap />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/help" element={<Help />} />  {/* ✅ FIXED */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

      </Routes>

    </Router>
  );
}

export default App;
