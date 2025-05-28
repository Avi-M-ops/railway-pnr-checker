const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

app.get('/api/pnr/:pnr', async (req, res) => {
  try {
    const response = await axios.get(`https://indianrailapi.com/api/v2/PNRCheck/apikey/${process.env.API_KEY}/PNRNumber/${req.params.pnr}/`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch PNR status' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
