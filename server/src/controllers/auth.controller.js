const authService = require('../services/auth.service');
const cookieConfig = require('../config/cokieConfig');
const formatResponse = require('../utils/formatResponce');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res
      .status(201)
      .cookie('refreshToken', result.refreshToken, cookieConfig)
      .json(formatResponse(201, 'User registered', {
        user: result.user,
        accessToken: result.accessToken,
      }));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res
      .cookie('refreshToken', result.refreshToken, cookieConfig)
      .json(formatResponse(200, 'User logged in', {
        user: result.user,
        accessToken: result.accessToken,
      }));
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await authService.refresh(res.locals.user);

    res
      .cookie('refreshToken', result.refreshToken, cookieConfig)
      .json(formatResponse(200, 'Token refreshed', {
        user: result.user,
        accessToken: result.accessToken,
      }));
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken').json(formatResponse(200, 'User logged out'));
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getMe(res.locals.user.id);
    res.json(formatResponse(200, 'Current user loaded', user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  me,
  refresh,
  register,
};
