const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  analytics: [
    {
      ip: String,
      userAgent: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Url', UrlSchema);
