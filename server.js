
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

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
    res.status(500).json({ success: false, error: 'Unable to fetch PNR status.' });
  }
});

app.get('/api/train/:trainNo', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://indian-railway-irctc.p.rapidapi.com/api/trains-search/v1/train/${req.params.trainNo}?isH5=true&client=web`,
      headers: {
        'x-rapid-api': 'rapid-api-database',
        'x-rapidapi-host': 'indian-railway-irctc.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    };
    const response = await axios.request(options);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Unable to fetch train status.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
