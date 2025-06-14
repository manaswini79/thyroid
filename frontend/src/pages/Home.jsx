import React, { useState } from "react";
import { Link } from "react-router-dom";


const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const backgroundStyle = {
    backgroundColor: darkMode ? "#000000" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",
    minHeight: "100vh",
    transition: "background-color 0.3s, color 0.3s",
  };

  const cardStyle = {
    backgroundColor: darkMode ? "#111111" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",
    border: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const btnStyle = {
    backgroundColor: darkMode ? "#ffffff" : "#000000",
    color: darkMode ? "#000000" : "#ffffff",
    border: "none",
    padding: "0.5rem 1.5rem",
    fontWeight: "500",
  };

  const iconBtnStyle = {
    background: "transparent",
    border: "1px solid",
    color: darkMode ? "#ffffff" : "#000000",
    padding: "4px 10px",
    borderRadius: "5px",
  };

  return (
    <div style={backgroundStyle}>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">ThyroLead</h2>
          <button onClick={toggleTheme} style={iconBtnStyle}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Welcome to ThyroLead</h1>
          <p style={{ color: darkMode ? "#dddddd" : "#555555" }}>
            Predict thyroid conditions & find nearby hospitals effortlessly.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="row justify-content-center gy-4">
          {/* Predict Card */}
          <div className="col-md-6">
            <div className="card text-center p-4" style={cardStyle}>
              <h4 className="fw-semibold">🧪 Predict Thyroid Condition</h4>
              <p className="mt-3">
                Answer a few questions and let our AI model assess your thyroid health.
              </p>
              <Link to="/form" style={btnStyle} className="btn mt-3">
                Predict Now
              </Link>
            </div>
          </div>

          {/* Hospital Card */}
          <div className="col-md-6">
            <div className="card text-center p-4" style={cardStyle}>
              <h4 className="fw-semibold">🏥 Find Nearby Hospitals</h4>
              <p className="mt-3">
                Use your location to discover hospitals treating thyroid disorders.
              </p>
              <Link to="/maps" style={btnStyle} className="btn mt-3">
                Locate Hospitals
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 pt-4 border-top">
          <small style={{ color: darkMode ? "#bbbbbb" : "#666666" }}>
            © 2023 ThyroLead · Made with React & Bootstrap
          </small>
        </div>
      </div>
    </div>
  );
};

export default Home;
