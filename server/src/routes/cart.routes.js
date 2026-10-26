const express = require('express');
const cartController = require('../controllers/cart.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const router = express.Router();

router.get('/', verifyAccessToken, cartController.getCart);
router.post('/:listingId', verifyAccessToken, cartController.addToCart);
router.delete('/:listingId', verifyAccessToken, cartController.removeFromCart);
router.delete('/', verifyAccessToken, cartController.clearCart);

module.exports = router;
