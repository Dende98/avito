const favoritesService = require('../services/favorites.service');
const formatResponse = require('../utils/formatResponce');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await favoritesService.getFavorites(res.locals.user.id);
    res.json(formatResponse(200, 'Favorites loaded', favorites));
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
  try {
    const listing = await favoritesService.addFavorite({
      userId: res.locals.user.id,
      listingId: req.params.listingId,
    });
    res.status(201).json(formatResponse(201, 'Favorite added', listing));
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    await favoritesService.removeFavorite({
      userId: res.locals.user.id,
      listingId: req.params.listingId,
    });
    res.json(formatResponse(200, 'Favorite removed'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
