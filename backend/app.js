const express = require('express');
const cors = require('cors');
const collection = require('./mongodb'); // MongoDB model
const axios = require('axios');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());


app.post('/predict', async (req, res) => {
  try {
    const { username, ...featuresObject } = req.body;

    const features = [];
    for (let i = 1; i <= 21; i++) {
      const key = `feature_${i}`;
      const value = parseFloat(featuresObject[key]);
      if (isNaN(value)) throw new Error(`Invalid value for ${key}`);
      features.push(value);
    }

    // Using axios to call Flask API
    const flaskResponse = await axios.post(process.env.FLASK_API_URL, {
      input_data: features
    });

    const data = flaskResponse.data;

    if (!data.prediction && data.prediction !== 0) {
      console.error("Flask returned error:", data.message);
      return res.status(500).json({ error: 'Flask prediction failed', message: data.message });
    }

    const log = new collection({
      username,
      input_data: features,
      prediction: parseInt(data.prediction),
      message: data.message,
      timestamp: new Date(),
    });

    await log.save();

    res.status(200).json({
      prediction: data.prediction,
      message: data.message,
    });

  } catch (error) {
    console.error('Error during /predict:', error.message);
    res.status(500).json({ error: 'Prediction failed', details: error.message });
  }
});



// Start server
app.listen(port, () => {
  console.log(`✅ Node server running at http://localhost:${port}`);
});
