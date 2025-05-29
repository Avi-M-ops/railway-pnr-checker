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
    console.log("Full response:", JSON.stringify(response.data, null, 2)); // <-- Better visibility
    res.json(response.data);

  } catch (err) {
    console.error("PNR Fetch Error:", err.message);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch PNR status. Please try again later.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
