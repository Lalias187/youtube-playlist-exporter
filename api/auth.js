const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Auth failed', details: error.response?.data });
  }
};
