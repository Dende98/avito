const categoriesService = require('../services/categories.service');
const formatResponse = require('../utils/formatResponce');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.getCategories();
    res.json(formatResponse(200, 'Categories loaded', categories));
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoriesService.createCategory(req.body);
    res.status(201).json(formatResponse(201, 'Category created', category));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
};
