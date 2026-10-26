require('dotenv').config();

const express = require('express');
const serverConfig = require('./config/serverConfig');
const authRouter = require('./routes/auth.routes');
const listingsRouter = require('./routes/listings.routes');
const categoriesRouter = require('./routes/categories.routes');
const usersRouter = require('./routes/users.routes');
const favoritesRouter = require('./routes/favorites.routes');
const cartRouter = require('./routes/cart.routes');
const uploadsRouter = require('./routes/uploads.routes');
const formatResponse = require('./utils/formatResponce');

const app = express();
const PORT = process.env.PORT || 3000;

serverConfig(app);

app.get('/health', (req, res) => {
  res.json(formatResponse(200, 'Server is running', { uptime: process.uptime() }));
});

app.use('/api/listings', listingsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/uploads', uploadsRouter);

app.use((req, res) => {
  res.status(404).json(formatResponse(404, 'Route not found', null, 'NOT_FOUND'));
});

app.use((err, req, res, next) => {
  const isDatabaseUnavailable =
    err.code === 'P1001' ||
    err.code === 'P1003' ||
    err.code === 'P2021' ||
    err.message?.includes('DATABASE_URL') ||
    err.message?.includes('does not exist');

  const statusCode = err.statusCode || (isDatabaseUnavailable ? 503 : 500);
  const message = isDatabaseUnavailable
    ? 'Database is not ready. Create the database and run Prisma migrations.'
    : err.message || 'Internal server error';
  const code = err.code || (isDatabaseUnavailable ? 'DATABASE_NOT_READY' : 'SERVER_ERROR');

  res.status(statusCode).json(
    formatResponse(statusCode, message, null, code),
  );
});

app.listen(PORT, () => {
  console.log(`API server started on http://localhost:${PORT}`);
});
