const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsController = require('../controllers/uploads.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads', 'listings');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.post('/images', verifyAccessToken, upload.array('images', 8), uploadsController.uploadImages);

module.exports = router;
