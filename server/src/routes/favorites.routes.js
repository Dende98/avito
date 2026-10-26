const express = require('express');
const favoritesController = require('../controllers/favorites.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const router = express.Router();

router.get('/', verifyAccessToken, favoritesController.getFavorites);
router.post('/:listingId', verifyAccessToken, favoritesController.addFavorite);
router.delete('/:listingId', verifyAccessToken, favoritesController.removeFavorite);

module.exports = router;
