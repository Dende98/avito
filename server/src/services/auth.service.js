const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const generateJWTTokens = require('../utils/generateJWTTokens');
const HttpError = require('../utils/httpError');
const normalizePhone = require('../utils/normalizePhone');

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city,
  createdAt: user.createdAt,
});

const createAuthResult = (user) => ({
  user: publicUser(user),
  ...generateJWTTokens({ user: publicUser(user) }),
});

const register = async ({ name, email, password, phone, city }) => {
  if (!name || !email || !password || !city) {
    throw new HttpError(400, 'Name, email, password and city are required', 'VALIDATION_ERROR');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser?.passwordHash) {
    throw new HttpError(409, 'User with this email already exists', 'EMAIL_EXISTS');
  }

  const normalizedPhone = phone ? normalizePhone(phone) : null;

  if (phone && !normalizedPhone) {
    throw new HttpError(400, 'Phone must be a valid Russian number', 'INVALID_PHONE');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: { name, phone: normalizedPhone, city, passwordHash },
      })
    : await prisma.user.create({
        data: { name, email, phone: normalizedPhone, city, passwordHash },
      });

  return createAuthResult(user);
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required', 'VALIDATION_ERROR');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const isPasswordValid = user?.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !isPasswordValid) {
    throw new HttpError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  return createAuthResult(user);
};

const refresh = async (tokenUser) => {
  if (!tokenUser?.id) {
    throw new HttpError(401, 'Invalid refresh token payload', 'UNAUTHORIZED');
  }

  const user = await prisma.user.findUnique({ where: { id: tokenUser.id } });
  if (!user) {
    throw new HttpError(401, 'User not found', 'UNAUTHORIZED');
  }

  return createAuthResult(user);
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpError(404, 'User not found', 'NOT_FOUND');
  }

  return publicUser(user);
};

module.exports = {
  getMe,
  login,
  refresh,
  register,
};
