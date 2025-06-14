import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Result = () => {
    const location = useLocation();
  const prediction = location.state?.prediction;
  if (prediction === undefined) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>No Prediction Data</h1>
        <p>Please submit the form first to view the result.</p>
        <Link to="/" style={homeLinkStyle}>← Go back to Home</Link>
      </div>
    </div>
  );
}
  const containerStyle = {
    backgroundColor: "#ffffff",
    color: "#000000",
    minHeight: "100vh",
    padding: "2rem 1rem",
    fontFamily: "Segoe UI, sans-serif",
  };

  const cardStyle = {
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#ffffff",
    padding: "2rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
  };

  const headingStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const subHeadingStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginTop: "1.5rem",
    color: "#c0392b",
  };

  const safeTextStyle = {
    color: "#27ae60",
  };

  const buttonStyle = {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "0.6rem 1.2rem",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    display: "inline-block",
    marginTop: "1rem",
  };

  const homeLinkStyle = {
    display: "block",
    marginTop: "2rem",
    color: "#555",
    textDecoration: "underline",
  };

  const renderContent = () => {
    switch (prediction) {
      case 0:
        return (
          <>
            <h2 style={subHeadingStyle}>The patient has compensated hypothyroid.</h2>
            <p>This condition is suboptimal thyroid function compensated by increased TSH.</p>
            <SymptomsList symptoms={[
              "Fatigue and weakness.",
              "Weight gain.",
              "Dry skin and hair.",
              "Cold intolerance.",
              "Constipation.",
              "Depression.",
            ]} />
          </>
        );
      case 1:
        return (
          <>
            <h2 style={subHeadingStyle}>The patient has hyperthyroid.</h2>
            <SymptomsList symptoms={[
              "Weight loss.",
              "Rapid or irregular heartbeat.",
              "Anxiety or nervousness.",
              "Irritability.",
              "Heat intolerance.",
              "Muscle weakness.",
            ]} />
          </>
        );
      case 2:
        return (
          <>
            <h2 style={{ ...subHeadingStyle, ...safeTextStyle }}>
              The patient is healthy without thyroid disorder.
            </h2>
            <p>No signs of thyroid disorder were detected. However, consult a doctor for full diagnosis.</p>
          </>
        );
      case 3:
        return (
          <>
            <h2 style={subHeadingStyle}>The patient has primary hypothyroid.</h2>
            <p>The thyroid gland doesn’t produce enough hormones.</p>
            <SymptomsList symptoms={[
              "Fatigue and weakness.",
              "Weight gain.",
              "Dry skin and hair.",
              "Cold intolerance.",
              "Constipation.",
              "Depression.",
            ]} />
          </>
        );
      case 4:
        return (
          <>
            <h2 style={subHeadingStyle}>The patient has secondary hypothyroid.</h2>
            <p>The thyroid is not stimulated enough by the pituitary gland.</p>
            <SymptomsList symptoms={[
              "Fatigue and weakness.",
              "Weight gain.",
              "Dry skin and hair.",
              "Cold intolerance.",
              "Constipation.",
              "Depression.",
            ]} />
          </>
        );
      default:
        return <p>Error in prediction.</p>;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Prediction Result</h1>
        {renderContent()}

        <div style={{ marginTop: "2rem" }}>
          <p>
            <strong>Seek medical care:</strong><br />
            <Link to="/maps" style={buttonStyle}>Find Hospitals</Link>
          </p>
          <p>
          </p>
          <Link to="/" style={homeLinkStyle}>← Go back to Home</Link>
        </div>
      </div>
    </div>
  );
};

const SymptomsList = ({ symptoms }) => {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <p style={{ fontWeight: "bold" }}>Have you been experiencing these symptoms?</p>
      <ul style={{ paddingLeft: "1.2rem" }}>
        {symptoms.map((symptom, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>{symptom}</li>
        ))}
      </ul>
      <p style={{ fontWeight: "bold", marginTop: "1rem" }}>When to See a Doctor:</p>
      <ul style={{ paddingLeft: "1.2rem" }}>
        <li>If experiencing persistent symptoms.</li>
        <li>If you have a family history of thyroid disorders.</li>
        <li>For routine check-ups and screenings.</li>
      </ul>
    </div>
  );
};

export default Result;
