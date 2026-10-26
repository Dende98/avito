const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/formatResponce');

function verifyRefreshToken(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    const { user } = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN || 'dev-refresh-secret');
    res.locals.user = user;
    next();
  } catch ({ message }) {
    res
      .status(401)
      .clearCookie('refreshToken')
      .json(formatResponse(401, 'Invalid refresh token', null, message));
  }
}

module.exports = verifyRefreshToken;
