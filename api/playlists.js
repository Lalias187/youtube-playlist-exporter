const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { accessToken } = req.body || {};

  try {
    let playlists = [];
    let pageToken = null;

    do {
      const params = { part: 'snippet,contentDetails', mine: true, maxResults: 50 };
      if (pageToken) params.pageToken = pageToken;

      const response = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      playlists = playlists.concat(response.data.items);
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    const special = [
      {
        id: 'LM',
        snippet: {
          title: "J'aime (Liked Music)",
          thumbnails: { medium: { url: 'https://www.gstatic.com/youtube/img/music/liked_songs.png' } },
        },
        contentDetails: { itemCount: '?' },
      },
    ];

    res.status(200).json({ playlists: [...special, ...playlists] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
};
