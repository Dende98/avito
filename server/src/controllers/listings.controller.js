const listingsService = require('../services/listings.service');
const formatResponse = require('../utils/formatResponce');

const getListings = async (req, res, next) => {
  try {
    const listings = await listingsService.getListings(req.query);
    res.json(formatResponse(200, 'Listings loaded', listings));
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
  try {
    const listing = await listingsService.getListingById(req.params.id);
    res.json(formatResponse(200, 'Listing loaded', listing));
  } catch (error) {
    next(error);
  }
};

const createListing = async (req, res, next) => {
  try {
    const listing = await listingsService.createListing({
      payload: req.body,
      user: res.locals.user,
    });
    res.status(201).json(formatResponse(201, 'Listing created', listing));
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const listing = await listingsService.updateListing({
      listingId: req.params.id,
      payload: req.body,
      user: res.locals.user,
    });
    res.json(formatResponse(200, 'Listing updated', listing));
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    await listingsService.deleteListing({
      listingId: req.params.id,
      user: res.locals.user,
    });
    res.json(formatResponse(200, 'Listing deleted'));
  } catch (error) {
    next(error);
  }
};

const getMyListings = async (req, res, next) => {
  try {
    const listings = await listingsService.getMyListings(res.locals.user.id);
    res.json(formatResponse(200, 'User listings loaded', listings));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  getMyListings,
  updateListing,
};
