const express = require('express');
const listingsController = require('../controllers/listings.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const router = express.Router();

router.get('/', listingsController.getListings);
router.get('/my', verifyAccessToken, listingsController.getMyListings);
router.get('/:id', listingsController.getListingById);
router.post('/', verifyAccessToken, listingsController.createListing);
router.patch('/:id', verifyAccessToken, listingsController.updateListing);
router.delete('/:id', verifyAccessToken, listingsController.deleteListing);

module.exports = router;
