const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/formatResponce');

function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { user } = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN || 'dev-access-secret');
    res.locals.user = user;
    next();
  } catch ({ message }) {
    res.status(403).json(formatResponse(403, 'Invalid access token', null, message));
  }
}

module.exports = verifyAccessToken;
