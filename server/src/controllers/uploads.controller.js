const formatResponse = require('../utils/formatResponce');

const uploadImages = (req, res) => {
  const images = req.files.map((file) => `/uploads/listings/${file.filename}`);
  res.status(201).json(formatResponse(201, 'Images uploaded', images));
};

module.exports = {
  uploadImages,
};
