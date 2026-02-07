const OptimizationEngine = require('../utils/optimizationEngine');

// @desc    Get optimization suggestions
// @route   GET /api/optimization/suggestions
// @access  Private
exports.getSuggestions = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const suggestions = await OptimizationEngine.generateSuggestions(parseInt(days));

    // Group by priority
    const grouped = {
      high: suggestions.filter(s => s.priority === 'high'),
      medium: suggestions.filter(s => s.priority === 'medium'),
      low: suggestions.filter(s => s.priority === 'low')
    };

    res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
      grouped
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating optimization suggestions',
      error: error.message
    });
  }
};

// @desc    Get suggestions by type
// @route   GET /api/optimization/suggestions/:type
// @access  Private
exports.getSuggestionsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { days = 7 } = req.query;
    
    const allSuggestions = await OptimizationEngine.generateSuggestions(parseInt(days));
    const filteredSuggestions = allSuggestions.filter(s => s.type === type);

    res.status(200).json({
      success: true,
      count: filteredSuggestions.length,
      data: filteredSuggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
};
