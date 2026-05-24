const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { accessToken, playlistId } = req.body || {};

  try {
    let videos = [];
    let pageToken = null;

    do {
      const params = { part: 'snippet,contentDetails', playlistId, maxResults: 50 };
      if (pageToken) params.pageToken = pageToken;

      const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      videos = videos.concat(response.data.items);
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};
