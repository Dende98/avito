const prisma = require('../db/prisma');
const HttpError = require('../utils/httpError');

const getCategories = () =>
  prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { listings: true },
      },
    },
  });

const createCategory = ({ name, slug }) => {
  if (!name || !slug) {
    throw new HttpError(400, 'Name and slug are required', 'VALIDATION_ERROR');
  }

  return prisma.category.create({
    data: { name, slug },
  });
};

module.exports = {
  createCategory,
  getCategories,
};
