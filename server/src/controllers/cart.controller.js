const cartService = require('../services/cart.service');
const formatResponse = require('../utils/formatResponce');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(res.locals.user.id);
    res.json(formatResponse(200, 'Cart loaded', cart));
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const listing = await cartService.addToCart({
      userId: res.locals.user.id,
      listingId: req.params.listingId,
    });
    res.status(201).json(formatResponse(201, 'Listing added to cart', listing));
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    await cartService.removeFromCart({
      userId: res.locals.user.id,
      listingId: req.params.listingId,
    });
    res.json(formatResponse(200, 'Listing removed from cart'));
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart({ userId: res.locals.user.id });
    res.json(formatResponse(200, 'Cart cleared'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
};
