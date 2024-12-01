const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');

// Shorten a URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  if (!originalUrl) return res.status(400).json({ error: 'Invalid URL' });

  const shortUrl = shortid.generate();
  const newUrl = new Url({ originalUrl, shortUrl });

  await newUrl.save();
  res.status(201).json({ originalUrl, shortUrl: `${baseUrl}/${shortUrl}` });
});

// Redirect to the original URL
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (!url) return res.status(404).json({ error: 'URL not found' });

  // Update analytics
  url.clicks++;
  url.analytics.push({
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  await url.save();

  res.redirect(url.originalUrl);
});

// Get analytics
router.get('/analytics/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (!url) return res.status(404).json({ error: 'URL not found' });

  res.json({
    originalUrl: url.originalUrl,
    shortUrl: url.shortUrl,
    clicks: url.clicks,
    analytics: url.analytics,
  });
});

module.exports = router;
