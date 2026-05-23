const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { accessToken, playlistId } = JSON.parse(event.body || '{}');

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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch videos' }),
    };
  }
};
