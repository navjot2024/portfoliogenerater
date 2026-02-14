const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const aiService = require('../services/aiService');

/**
 * @desc    Get all portfolios for logged-in user
 * @route   GET /api/portfolios
 * @access  Private
 */
exports.getPortfolios = asyncHandler(async (req, res, next) => {
  const portfolios = await Portfolio.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .select('-__v');

  res.status(200).json({
    success: true,
    count: portfolios.length,
    data: portfolios
  });
});

/**
 * @desc    Get single portfolio
 * @route   GET /api/portfolios/:id
 * @access  Private
 */
exports.getPortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Ensure user owns this portfolio
  if (portfolio.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to access this portfolio', 403)
    );
  }

  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Create new portfolio
 * @route   POST /api/portfolios
 * @access  Private
 */
exports.createPortfolio = asyncHandler(async (req, res, next) => {
  console.log('Creating portfolio with data:', JSON.stringify(req.body, null, 2));
  
  // Validate required fields
  if (!req.body.personalInfo || !req.body.personalInfo.fullName) {
    return next(new ErrorResponse('Full name is required', 400));
  }
  if (!req.body.personalInfo || !req.body.personalInfo.email) {
    return next(new ErrorResponse('Email is required', 400));
  }

  // Add user ID to req.body
  req.body.userId = req.user.id;

  try {
    // Create portfolio
    const portfolio = await Portfolio.create(req.body);

    res.status(201).json({
      success: true,
      data: portfolio,
      message: 'Portfolio created successfully'
    });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    throw error;
  }
});

/**
 * @desc    Create portfolio with AI enhancement
 * @route   POST /api/portfolios/create-with-ai
 * @access  Private
 */
exports.createPortfolioWithAI = asyncHandler(async (req, res, next) => {
  console.log('Received portfolio data:', JSON.stringify(req.body, null, 2));
  
  // Validate required fields
  if (!req.body.personalInfo || !req.body.personalInfo.fullName) {
    return next(new ErrorResponse('Full name is required', 400));
  }
  if (!req.body.personalInfo || !req.body.personalInfo.email) {
    return next(new ErrorResponse('Email is required', 400));
  }

  // Add user ID
  req.body.userId = req.user.id;

  try {
    // Enhance portfolio with AI
    const enhanced = await aiService.enhancePortfolio(req.body);
    console.log('Enhanced portfolio:', JSON.stringify(enhanced, null, 2));

    // Create portfolio with enhanced content
    const portfolio = await Portfolio.create(enhanced);

    res.status(201).json({
      success: true,
      data: portfolio,
      message: 'Portfolio created with AI enhancement'
    });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    throw error;
  }
});

/**
 * @desc    Update portfolio
 * @route   PUT /api/portfolios/:id
 * @access  Private
 */
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
  let portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Ensure user owns this portfolio
  if (portfolio.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to update this portfolio', 403)
    );
  }

  portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: portfolio,
    message: 'Portfolio updated successfully'
  });
});

/**
 * @desc    Delete portfolio
 * @route   DELETE /api/portfolios/:id
 * @access  Private
 */
exports.deletePortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Ensure user owns this portfolio
  if (portfolio.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to delete this portfolio', 403)
    );
  }

  await portfolio.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Portfolio deleted successfully'
  });
});

/**
 * @desc    Get public portfolio by slug
 * @route   GET /api/portfolios/public/:slug
 * @access  Public
 */
exports.getPublicPortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({
    slug: req.params.slug,
    published: true
  }).select('-userId -__v');

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Increment view count
  await portfolio.incrementViews();

  res.status(200).json({
    success: true,
    data: portfolio
  });
});

/**
 * @desc    Duplicate portfolio
 * @route   POST /api/portfolios/:id/duplicate
 * @access  Private
 */
exports.duplicatePortfolio = asyncHandler(async (req, res, next) => {
  const originalPortfolio = await Portfolio.findById(req.params.id);

  if (!originalPortfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Ensure user owns this portfolio
  if (originalPortfolio.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to duplicate this portfolio', 403)
    );
  }

  // Create copy
  const portfolioData = originalPortfolio.toObject();
  delete portfolioData._id;
  delete portfolioData.slug;
  portfolioData.title = `${portfolioData.title} (Copy)`;
  portfolioData.published = false;
  portfolioData.views = 0;

  const newPortfolio = await Portfolio.create(portfolioData);

  res.status(201).json({
    success: true,
    data: newPortfolio,
    message: 'Portfolio duplicated successfully'
  });
});

/**
 * @desc    Publish/Unpublish portfolio
 * @route   PATCH /api/portfolios/:id/publish
 * @access  Private
 */
exports.togglePublish = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return next(new ErrorResponse('Portfolio not found', 404));
  }

  // Ensure user owns this portfolio
  if (portfolio.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse('Not authorized to modify this portfolio', 403)
    );
  }

  portfolio.published = !portfolio.published;
  await portfolio.save();

  res.status(200).json({
    success: true,
    data: portfolio,
    message: `Portfolio ${portfolio.published ? 'published' : 'unpublished'} successfully`
  });
});
