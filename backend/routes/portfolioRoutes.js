const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPortfolios,
  getPortfolio,
  createPortfolio,
  createPortfolioWithAI,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolio,
  duplicatePortfolio,
  togglePublish
} = require('../controllers/portfolioController');

// Protected routes (require authentication)
router.route('/')
  .get(protect, getPortfolios)
  .post(protect, createPortfolio);

router.post('/create-with-ai', protect, createPortfolioWithAI);

router.route('/:id')
  .get(protect, getPortfolio)
  .put(protect, updatePortfolio)
  .delete(protect, deletePortfolio);

router.post('/:id/duplicate', protect, duplicatePortfolio);
router.patch('/:id/publish', protect, togglePublish);

// Public route (no authentication required)
router.get('/public/:slug', getPublicPortfolio);

module.exports = router;
