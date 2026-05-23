const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { accessToken } = JSON.parse(event.body || '{}');

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlists }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch playlists' }),
    };
  }
};
