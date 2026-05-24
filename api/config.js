module.exports = async (req, res) => {
  res.status(200).json({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
};
