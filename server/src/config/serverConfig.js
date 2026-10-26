const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const accessLogStream = fs.createWriteStream(
  path.join(logsDir, `access_${new Date().toLocaleDateString('ru-RU').replaceAll('.', '-')}.log`),
  { flags: 'a' },
);

const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true,
};

const serverConfig = (app) => {
  app.disable('x-powered-by');
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(cookieParser());
};

module.exports = serverConfig;
