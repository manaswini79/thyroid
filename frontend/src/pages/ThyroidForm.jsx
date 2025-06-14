import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ThyroidForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    feature_1: '',
    feature_2: '1',
    feature_3: '0', feature_4: '0', feature_5: '0', feature_6: '0',
    feature_7: '0', feature_8: '0', feature_9: '0', feature_10: '0',
    feature_11: '0', feature_12: '0', feature_13: '0', feature_14: '0',
    feature_15: '0', feature_16: '0',
    feature_17: '', feature_18: '', feature_19: '', feature_20: '', feature_21: ''
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}`, formData);
    const result = response.data;
    navigate('/result', { state: { prediction: result.prediction } });


  } catch (err) {
    console.error("Error during prediction:", err);
  }
};


  const booleanLabels = [
    'Are you currently on any thyroxine medication?',
    'Is there a concern regarding thyroxine usage?',
    'Are you on any antithyroid medication?',
    'Are you currently experiencing illness?',
    'Are you currently pregnant?',
    'Have you undergone thyroid surgery?',
    'Have you received Iodine 131 treatment before?',
    'Is there any concern for hypothyroidism?',
    'Is there any concern for hyperthyroidism?',
    'Have you ever taken lithium medication in any form?',
    'Do you have a goitre?',
    'Have you been diagnosed with a tumor?',
    'Do you have hypopituitarism?',
    'Do you have any psychological conditions?'
  ];

  const inputStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
    borderRadius: '6px',
    padding: '0.75rem',
    marginBottom: '1.5rem',
    width: '100%'
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', padding: '4rem 1rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="fw-bold text-center mb-5" style={{ fontSize: '2.5rem' }}>Thyroid Predictor Form</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>What is your name?</label>
            <input name="username" type="text" style={inputStyle} className="form-control" placeholder="Enter your name" required onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>What is your age?</label>
            <input name="feature_1" type="number" style={inputStyle} className="form-control" placeholder="Enter your age" required onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>What is your gender?</label>
            <select name="feature_2" style={inputStyle} className="form-select" onChange={handleChange}>
              <option value="1">Female</option>
              <option value="2">Male</option>
            </select>
          </div>

          {booleanLabels.map((label, i) => (
            <div className="mb-4" key={i + 3}>
              <label>{label}</label>
              <select name={`feature_${i + 3}`} style={inputStyle} className="form-select" onChange={handleChange}>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          ))}

          <div className="mb-4">
            <label>Enter your TSH level (in mIU/L)</label>
            <input name="feature_17" type="number" step="any" style={inputStyle} className="form-control" required onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Enter your T3 level (in ng/dL)</label>
            <input name="feature_18" type="number" step="any" style={inputStyle} className="form-control" required onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Enter your TT4 level (in µg/dL)</label>
            <input name="feature_19" type="number" step="any" style={inputStyle} className="form-control" required onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Enter your T4U test result</label>
            <input name="feature_20" type="number" step="any" style={inputStyle} className="form-control" required onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label>Enter your Free Thyroxine Index (FTI)</label>
            <input name="feature_21" type="number" step="any" style={inputStyle} className="form-control" required onChange={handleChange} />
          </div>

          <div className="text-center mt-5">
            <button type="submit" className="btn btn-dark px-5 py-2 fw-semibold">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThyroidForm;
