const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  enhanceBio,
  enhanceProject,
  enhanceExperience,
  enhancePortfolio,
  recommendTheme,
  testAI
} = require('../controllers/aiController');

// All AI routes require authentication
router.post('/enhance/bio', protect, enhanceBio);
router.post('/enhance/project', protect, enhanceProject);
router.post('/enhance/experience', protect, enhanceExperience);
router.post('/enhance/portfolio', protect, enhancePortfolio);
router.post('/recommend-theme', protect, recommendTheme);
router.get('/test', protect, testAI);

module.exports = router;
