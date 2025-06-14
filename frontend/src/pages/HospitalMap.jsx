import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const HospitalMap = () => {
  const [address, setAddress] = useState("");
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load Overpass script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/overpass-leaflet@0.2.0/dist/overpass-leaflet.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const findHospitals = async () => {
    if (!address.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        if (map) {
          map.remove();
        }

        const newMap = L.map("map").setView([lat, lon], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(newMap);

        L.marker([lat, lon]).addTo(newMap).bindPopup("Your Location").openPopup();
        L.circle([lat, lon], { radius: 90000 }).addTo(newMap);

        if (L.overpassLayer) {
          const overpassQuery = `[out:json]; node(around:50000,${lat},${lon})[amenity=hospital]; out;`;
          const overpassLayer = L.overpassLayer(overpassQuery, {
            minZoom: 10,
            markerIcon: L.icon({
              iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
              iconSize: [50, 50],
              iconAnchor: [15, 50],
              popupAnchor: [1, -34],
              shadowSize: [50, 50],
            }),
          });
          overpassLayer.addTo(newMap);
        }
        setMap(newMap);
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        padding: "4rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "2rem" }}>
        Find Nearby Hospitals
      </h1>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter a valid address"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "1rem",
          fontSize: "1rem",
          border: "1px solid #000000",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: "#000000",
          marginBottom: "1rem",
        }}
      />

      <button
        onClick={findHospitals}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "1rem",
          fontSize: "1rem",
          fontWeight: "600",
          backgroundColor: "#000000",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Find Hospitals
      </button>

      {loading && <p style={{ marginTop: "1rem" }}>Finding hospitals nearby...</p>}

      <div
        id="map"
        style={{
          marginTop: "2rem",
          width: "100%",
          maxWidth: "1000px",
          height: "70vh",
          borderRadius: "12px",
        }}
      ></div>
    </div>
  );
};

export default HospitalMap;
