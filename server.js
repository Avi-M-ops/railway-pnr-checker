const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));

// Logger middleware for requests and responses
app.use((req, res, next) => {
  console.log("▶️ Request URL:", req.method, req.originalUrl);
  if (Object.keys(req.body).length > 0) {
    console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
  }
  const oldSend = res.send;
  res.send = function (data) {
    try {
      const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log("✅ Response:", JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log("✅ Response (raw):", data);
    }
    oldSend.apply(res, arguments);
  };
  next();
});

// PNR Status Route
app.get('/api/pnr/:pnr', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${req.params.pnr}`,
      headers: {
        'x-rapidapi-host': 'irctc-indian-railway-pnr-status.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (err) {
    console.error("❌ PNR Fetch Error:", err.message);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch PNR status. Please try again later.'
    });
  }
});

// Train Status Route (Fixed)
app.get('/api/train/:trainNumber', async (req, res) => {
  try {
    const trainNumber = req.params.trainNumber;
    const url = `https://indian-railway-irctc.p.rapidapi.com/api/trains-search/v1/train/${trainNumber}?isH5=true&client=web`;

    const options = {
      method: 'GET',
      url: url,
      headers: {
        'x-rapid-api': 'rapid-api-database',
        'x-rapidapi-host': 'indian-railway-irctc.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Train status error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Train status fetch failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
