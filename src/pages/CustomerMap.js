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
    <div className="container-fluid mt-4">

      <h2 className="text-center text-white mb-4">
        Find & Book EV Charging Stations Near You ⚡
      </h2>

      <div className="row">

        {/* LEFT PANEL */}
        <div className="col-md-4">
          {stations.map(st => (
            <div
              key={st._id}
              className="card mb-3 p-3 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => drawRoute(st)}
            >
              <h6>{st.name}</h6>
              <p>
                Slots:
                <span style={{ color: getSlotColor(st.availableSlots), fontWeight: "bold" }}>
                  {" "} {st.availableSlots}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div className="col-md-8">

          {userPosition && (
            <MapContainer
              center={userPosition}
              zoom={11}
              style={{ height: "500px", borderRadius: "15px" }}
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
                  pathOptions={{ color: "blue", weight: 5 }}
                />
              )}
            </MapContainer>
          )}

          {/* ROUTE + PRICE */}
          {routeInfo && selectedStation && (
            <div className="card mt-3 p-3 text-center shadow">
              <strong>{selectedStation.name}</strong>
              <p>Distance: {routeInfo.distanceKm} km</p>
              <p>ETA: {routeInfo.etaMinutes} minutes</p>

              <div className="mb-2">
                <label className="me-3">
                  <input
                    type="radio"
                    value="normal"
                    checked={chargingType === "normal"}
                    onChange={(e) => setChargingType(e.target.value)}
                  /> Normal (₹12/kWh)
                </label>

                <label>
                  <input
                    type="radio"
                    value="fast"
                    checked={chargingType === "fast"}
                    onChange={(e) => setChargingType(e.target.value)}
                  /> Fast (₹18/kWh)
                </label>
              </div>

              <input
                type="number"
                min="10"
                max="100"
                className="form-control mb-2"
                value={chargePercent}
                onChange={(e) => setChargePercent(Number(e.target.value))}
              />

              {priceInfo && (
                <>
                  <p>Energy: {priceInfo.energyRequired} kWh</p>
                  <p><strong>Total Amount: ₹{priceInfo.totalAmount}</strong></p>
                </>
              )}

              {selectedStation.availableSlots > 0 ? (
                <button
                  className="btn btn-success"
                  onClick={proceedToPayment}
                >
                  Proceed to Payment
                </button>
              ) : (
                <p style={{ color: "red" }}>❌ No Slots Available</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CustomerMap;
