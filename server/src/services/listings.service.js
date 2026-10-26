const prisma = require('../db/prisma');
const HttpError = require('../utils/httpError');

const sellerSelect = {
  id: true,
  name: true,
  city: true,
  phone: true,
  email: true,
};

const toInt = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const buildListingWhere = ({ search, city, categoryId, minPrice, maxPrice }) => ({
  status: 'ACTIVE',
  ...(city ? { city: { contains: String(city), mode: 'insensitive' } } : {}),
  ...(categoryId ? { categoryId: String(categoryId) } : {}),
  ...(search
    ? {
        OR: [
          { title: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } },
        ],
      }
    : {}),
  ...((minPrice || maxPrice)
    ? {
        price: {
          ...(minPrice ? { gte: toInt(minPrice) } : {}),
          ...(maxPrice ? { lte: toInt(maxPrice) } : {}),
        },
      }
    : {}),
});

const getListings = (query) =>
  prisma.listing.findMany({
    where: buildListingWhere(query),
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      seller: { select: sellerSelect },
    },
  });

const getListingById = async (id) => {
  try {
    return await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        category: true,
        seller: { select: sellerSelect },
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new HttpError(404, 'Listing not found', 'NOT_FOUND');
    }
    throw error;
  }
};

const createListing = ({ payload, user }) => {
  const { title, description, price, city, address, images = [], categoryId } = payload;

  if (!title || !description || !price || !city || !categoryId) {
    throw new HttpError(400, 'Required listing fields are missing', 'VALIDATION_ERROR');
  }

  if (!user?.id) {
    throw new HttpError(401, 'Authorization is required', 'UNAUTHORIZED');
  }

  return prisma.listing.create({
    data: {
      title,
      description,
      price: Number(price),
      city,
      address,
      images: Array.isArray(images) ? images : [],
      category: { connect: { id: categoryId } },
      seller: { connect: { id: user.id } },
    },
    include: {
      category: true,
      seller: { select: sellerSelect },
    },
  });
};

const ensureListingOwner = async ({ listingId, userId }) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, sellerId: true },
  });

  if (!listing) {
    throw new HttpError(404, 'Listing not found', 'NOT_FOUND');
  }

  if (listing.sellerId !== userId) {
    throw new HttpError(403, 'You can manage only your own listings', 'FORBIDDEN');
  }

  return listing;
};

const updateListing = async ({ listingId, payload, user }) => {
  if (!user?.id) {
    throw new HttpError(401, 'Authorization is required', 'UNAUTHORIZED');
  }

  await ensureListingOwner({ listingId, userId: user.id });

  const { title, description, price, city, address, images, categoryId } = payload;

  if (!title || !description || !price || !city || !categoryId) {
    throw new HttpError(400, 'Required listing fields are missing', 'VALIDATION_ERROR');
  }

  return prisma.listing.update({
    where: { id: listingId },
    data: {
      title,
      description,
      price: Number(price),
      city,
      address,
      images: Array.isArray(images) ? images : [],
      category: { connect: { id: categoryId } },
    },
    include: {
      category: true,
      seller: { select: sellerSelect },
    },
  });
};

const deleteListing = async ({ listingId, user }) => {
  if (!user?.id) {
    throw new HttpError(401, 'Authorization is required', 'UNAUTHORIZED');
  }

  await ensureListingOwner({ listingId, userId: user.id });

  return prisma.listing.delete({
    where: { id: listingId },
  });
};

const getMyListings = (userId) =>
  prisma.listing.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      seller: { select: sellerSelect },
    },
  });

module.exports = {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  getMyListings,
  updateListing,
};
