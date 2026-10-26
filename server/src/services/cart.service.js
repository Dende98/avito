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

const getCart = async (userId) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        include: listingInclude,
      },
    },
  });

  return cartItems.map((item) => item.listing);
};

const addToCart = async ({ userId, listingId }) => {
  const cartItem = await prisma.cartItem.upsert({
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

  return cartItem.listing;
};

const removeFromCart = ({ userId, listingId }) =>
  prisma.cartItem.delete({
    where: {
      userId_listingId: { userId, listingId },
    },
  });

const clearCart = ({ userId }) =>
  prisma.cartItem.deleteMany({
    where: { userId },
  });

module.exports = {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
};
