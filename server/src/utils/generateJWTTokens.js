const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const generateJWTTokens = (payload) => ({
  accessToken: jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN || 'dev-access-secret', jwtConfig.access),
  refreshToken: jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN || 'dev-refresh-secret', jwtConfig.refresh),
});

module.exports = generateJWTTokens;
