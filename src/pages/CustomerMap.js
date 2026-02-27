import React, { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import API from "../api";

function CustomerMap() {

  const navigate = useNavigate();

  const [userPosition, setUserPosition] = useState(null);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  const [chargingType, setChargingType] = useState("normal");
  const [chargePercent, setChargePercent] = useState(50);
  const [priceInfo, setPriceInfo] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ===============================
     GET CURRENT LOCATION
  =============================== */

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Enable location access")
    );
  }, []);

  /* ===============================
     FETCH STATIONS
  =============================== */

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await API.get("/api/stations");
        setStations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStations();
  }, []);

  /* ===============================
     DRAW ROUTE
  =============================== */

  const drawRoute = useCallback(async (station) => {
    if (!userPosition) return;

    try {
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${userPosition[1]},${userPosition[0]};` +
        `${station.longitude},${station.latitude}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0) return;

      const route = data.routes[0];

      const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
      setRouteCoords(coords);

      const distanceKm = (route.distance / 1000).toFixed(2);
      const etaMinutes = Math.round(route.duration / 60);

      setRouteInfo({ distanceKm, etaMinutes });
      setSelectedStation(station);

    } catch (err) {
      console.log("Route error:", err);
    }
  }, [userPosition]);

  /* ===============================
     AUTO SELECT NEAREST
  =============================== */

  useEffect(() => {
    if (!userPosition || stations.length === 0) return;

    let nearest = stations[0];
    let min = Infinity;

    stations.forEach(st => {
      const d = Math.sqrt(
        Math.pow(st.latitude - userPosition[0], 2) +
        Math.pow(st.longitude - userPosition[1], 2)
      );
      if (d < min) {
        min = d;
        nearest = st;
      }
    });

    drawRoute(nearest);

  }, [userPosition, stations, drawRoute]);

  /* ===============================
     PRICE CALCULATION
  =============================== */

  useEffect(() => {

    const batteryCapacity = (user?.fullRange || 400) / 10;
    const energyRequired = (chargePercent / 100) * batteryCapacity;

    const rate = chargingType === "fast" ? 18 : 12;
    const totalAmount = energyRequired * rate;

    setPriceInfo({
      energyRequired: energyRequired.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });

  }, [chargingType, chargePercent]);

  /* ===============================
     SLOT COLOR
  =============================== */

  const getSlotColor = (slots) => {
    if (slots === 0) return "red";
    if (slots <= 2) return "orange";
    return "green";
  };

  const createIcon = (color) =>
    new L.Icon({
      iconUrl:
        color === "green"
          ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
          : color === "orange"
          ? "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
          : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      iconSize: [32, 32]
    });

  /* ===============================
     NAVIGATE TO PAYMENT
  =============================== */

  const proceedToPayment = () => {

    if (!selectedStation) return;

    navigate("/payment", {
      state: {
        station: selectedStation,
        routeInfo,
        chargingType,
        chargePercent,
        priceInfo
      }
    });
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div className="container-fluid mt-4 px-4">

      <h2 className="text-center mb-4" style={{ 
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        🗺️ Find & Book EV Charging Stations
      </h2>

      <div className="row">

        {/* LEFT PANEL */}
        <div className="col-md-4 mb-4">
          <div style={{ 
            background: 'rgba(31, 44, 58, 0.6)',
            padding: '20px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 198, 255, 0.2)',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            <h5 className="mb-3" style={{ color: '#00c6ff' }}>
              ⚡ Available Stations
            </h5>
            {stations.map(st => (
              <div
                key={st._id}
                className="card mb-3 p-3"
                style={{ 
                  cursor: "pointer",
                  transition: 'all 0.3s ease',
                  border: selectedStation?._id === st._id 
                    ? '2px solid #00c6ff' 
                    : '1px solid rgba(0, 198, 255, 0.1)'
                }}
                onClick={() => drawRoute(st)}
              >
                <h6 style={{ marginBottom: '10px', color: '#00c6ff' }}>{st.name}</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.9rem', color: '#e8eaf6' }}>Available Slots:</span>
                  <span style={{ 
                    color: getSlotColor(st.availableSlots), 
                    fontWeight: "bold",
                    fontSize: '1.1rem'
                  }}>
                    {st.availableSlots}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAP */}
        <div className="col-md-8">

          {userPosition && (
            <MapContainer
              center={userPosition}
              zoom={11}
              style={{ 
                height: "500px", 
                borderRadius: "20px",
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(0, 198, 255, 0.2)'
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={userPosition}>
                <Popup>You are here 📍</Popup>
              </Marker>

              {stations.map(st => (
                <Marker
                  key={st._id}
                  position={[st.latitude, st.longitude]}
                  icon={createIcon(getSlotColor(st.availableSlots))}
                >
                  <Popup>
                    <h6>{st.name}</h6>
                    <p>Available Slots: {st.availableSlots}</p>
                  </Popup>
                </Marker>
              ))}

              {routeCoords.length > 0 && (
                <Polyline
                  positions={routeCoords}
                  pathOptions={{ color: "#00c6ff", weight: 5 }}
                />
              )}
            </MapContainer>
          )}

          {/* ROUTE + PRICE */}
          {routeInfo && selectedStation && (
            <div className="card mt-4 p-4 shadow">
              
              <div className="text-center mb-3">
                <h4 style={{ color: '#00c6ff', marginBottom: '15px' }}>
                  🏭 {selectedStation.name}
                </h4>
                <div className="row">
                  <div className="col-6">
                    <div style={{ 
                      background: 'rgba(0, 198, 255, 0.1)',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 198, 255, 0.2)'
                    }}>
                      <p style={{ marginBottom: '5px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Distance</p>
                      <p style={{ marginBottom: '0', fontSize: '1.3rem', fontWeight: '700' }}>
                        {routeInfo.distanceKm} km
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div style={{ 
                      background: 'rgba(150, 201, 61, 0.1)',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid rgba(150, 201, 61, 0.2)'
                    }}>
                      <p style={{ marginBottom: '5px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>ETA</p>
                      <p style={{ marginBottom: '0', fontSize: '1.3rem', fontWeight: '700' }}>
                        {routeInfo.etaMinutes} mins
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '10px' }}>
                  ⚡ Charging Type
                </label>
                <div className="d-flex gap-3">
                  <label style={{ 
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: chargingType === 'normal' 
                      ? '2px solid #00c6ff' 
                      : '2px solid rgba(255,255,255,0.2)',
                    background: chargingType === 'normal'
                      ? 'rgba(0, 198, 255, 0.1)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}>
                    <input
                      type="radio"
                      value="normal"
                      checked={chargingType === "normal"}
                      onChange={(e) => setChargingType(e.target.value)}
                      style={{ marginRight: '8px' }}
                    />
                    <strong>Normal</strong><br/>
                    <small>(₹12/kWh)</small>
                  </label>

                  <label style={{ 
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: chargingType === 'fast' 
                      ? '2px solid #ff416c' 
                      : '2px solid rgba(255,255,255,0.2)',
                    background: chargingType === 'fast'
                      ? 'rgba(255, 65, 108, 0.1)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}>
                    <input
                      type="radio"
                      value="fast"
                      checked={chargingType === "fast"}
                      onChange={(e) => setChargingType(e.target.value)}
                      style={{ marginRight: '8px' }}
                    />
                    <strong>Fast</strong><br/>
                    <small>(₹18/kWh)</small>
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '600' }}>
                  🔋 Battery % To Charge: <strong>{chargePercent}%</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  className="form-range"
                  value={chargePercent}
                  onChange={(e) => setChargePercent(Number(e.target.value))}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              {priceInfo && (
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(0, 176, 155, 0.15), rgba(150, 201, 61, 0.15))',
                  padding: '20px',
                  borderRadius: '15px',
                  marginBottom: '20px',
                  border: '1px solid rgba(0, 176, 155, 0.3)',
                  textAlign: 'center'
                }}>
                  <p style={{ marginBottom: '8px', fontSize: '1.05rem' }}>
                    <strong>⚡ Energy Required:</strong> {priceInfo.energyRequired} kWh
                  </p>
                  <p style={{ marginBottom: '0', fontSize: '1.5rem', fontWeight: '700', color: '#96c93d' }}>
                    💵 Total: ₹{priceInfo.totalAmount}
                  </p>
                </div>
              )}

              {selectedStation.availableSlots > 0 ? (
                <button
                  className="btn btn-success w-100"
                  onClick={proceedToPayment}
                  style={{ fontSize: '1.1rem', padding: '14px' }}
                >
                  🚀 Proceed to Payment
                </button>
              ) : (
                <div style={{ 
                  background: 'rgba(255, 65, 108, 0.2)',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 65, 108, 0.4)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#ff6b9d', marginBottom: '0', fontWeight: '600' }}>
                    ❌ No Slots Available
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CustomerMap;
