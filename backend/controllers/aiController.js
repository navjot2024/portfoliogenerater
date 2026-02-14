const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const aiService = require('../services/aiService');

/**
 * @desc    Enhance bio/about section
 * @route   POST /api/ai/enhance/bio
 * @access  Private
 */
exports.enhanceBio = asyncHandler(async (req, res, next) => {
  const { bio, context } = req.body;

  if (!bio) {
    return next(new ErrorResponse('Please provide bio text', 400));
  }

  const enhanced = await aiService.enhanceBio(bio, context || {});

  res.status(200).json({
    success: true,
    data: {
      original: bio,
      enhanced: enhanced
    }
  });
});

/**
 * @desc    Enhance project description
 * @route   POST /api/ai/enhance/project
 * @access  Private
 */
exports.enhanceProject = asyncHandler(async (req, res, next) => {
  const { project, context } = req.body;

  if (!project || !project.description) {
    return next(new ErrorResponse('Please provide project data', 400));
  }

  const enhanced = await aiService.enhanceProject(project, context || {});

  res.status(200).json({
    success: true,
    data: {
      original: project.description,
      enhanced: enhanced
    }
  });
});

/**
 * @desc    Enhance experience description
 * @route   POST /api/ai/enhance/experience
 * @access  Private
 */
exports.enhanceExperience = asyncHandler(async (req, res, next) => {
  const { experience, context } = req.body;

  if (!experience || !experience.description) {
    return next(new ErrorResponse('Please provide experience data', 400));
  }

  const enhanced = await aiService.enhanceExperience(experience, context || {});

  res.status(200).json({
    success: true,
    data: {
      original: experience.description,
      enhanced: enhanced
    }
  });
});

/**
 * @desc    Enhance entire portfolio
 * @route   POST /api/ai/enhance/portfolio
 * @access  Private
 */
exports.enhancePortfolio = asyncHandler(async (req, res, next) => {
  const { portfolio } = req.body;

  if (!portfolio) {
    return next(new ErrorResponse('Please provide portfolio data', 400));
  }

  const enhanced = await aiService.enhancePortfolio(portfolio);

  res.status(200).json({
    success: true,
    data: enhanced
  });
});

/**
 * @desc    Get theme recommendations
 * @route   POST /api/ai/recommend-theme
 * @access  Private
 */
exports.recommendTheme = asyncHandler(async (req, res, next) => {
  const { portfolio } = req.body;

  if (!portfolio) {
    return next(new ErrorResponse('Please provide portfolio data', 400));
  }

  const recommendations = aiService.recommendTheme(portfolio);

  res.status(200).json({
    success: true,
    data: {
      recommendations,
      selected: recommendations[0].theme
    }
  });
});

/**
 * @desc    Test AI service connectivity
 * @route   GET /api/ai/test
 * @access  Private
 */
exports.testAI = asyncHandler(async (req, res, next) => {
  try {
    const testBio = "I am a developer who likes coding.";
    const enhanced = await aiService.enhanceBio(testBio, {
      careerLevel: 'student',
      field: 'software-engineering'
    });

    res.status(200).json({
      success: true,
      message: 'AI service is working',
      data: {
        original: testBio,
        enhanced: enhanced,
        aiAvailable: enhanced !== testBio
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'AI service using local fallback',
      data: {
        aiAvailable: false,
        fallbackActive: true
      }
    });
  }
});
