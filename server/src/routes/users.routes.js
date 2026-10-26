const express = require('express');
const listingsController = require('../controllers/listings.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const router = express.Router();

router.get('/me/listings', verifyAccessToken, listingsController.getMyListings);

module.exports = router;
