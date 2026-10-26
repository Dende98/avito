const prisma = require('../db/prisma');

const listingInclude = {
  category: true,
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      city: true,
    },
  },
};

const getFavorites = async (userId) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        include: listingInclude,
      },
    },
  });

  return favorites.map((favorite) => favorite.listing);
};

const addFavorite = async ({ userId, listingId }) => {
  const favorite = await prisma.favorite.upsert({
    where: {
      userId_listingId: { userId, listingId },
    },
    update: {},
    create: { userId, listingId },
    include: {
      listing: {
        include: listingInclude,
      },
    },
  });

  return favorite.listing;
};

const removeFavorite = ({ userId, listingId }) =>
  prisma.favorite.delete({
    where: {
      userId_listingId: { userId, listingId },
    },
  });

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
