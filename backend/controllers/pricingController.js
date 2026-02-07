const PricingRule = require('../models/PricingRule');

// @desc    Get all pricing rules
// @route   GET /api/pricing
// @access  Private
exports.getAllPricing = async (req, res) => {
  try {
    const pricingRules = await PricingRule.find().sort({ providerName: 1 });
    
    res.status(200).json({
      success: true,
      count: pricingRules.length,
      data: pricingRules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing rules',
      error: error.message
    });
  }
};

// @desc    Get single pricing rule
// @route   GET /api/pricing/:id
// @access  Private
exports.getPricing = async (req, res) => {
  try {
    const pricing = await PricingRule.findById(req.params.id);

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing rule',
      error: error.message
    });
  }
};

// @desc    Create pricing rule
// @route   POST /api/pricing
// @access  Private/Admin
exports.createPricing = async (req, res) => {
  try {
    const pricing = await PricingRule.create(req.body);

    res.status(201).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Pricing rule already exists for this provider'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating pricing rule',
      error: error.message
    });
  }
};

// @desc    Update pricing rule
// @route   PUT /api/pricing/:id
// @access  Private/Admin
exports.updatePricing = async (req, res) => {
  try {
    const pricing = await PricingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating pricing rule',
      error: error.message
    });
  }
};

// @desc    Delete pricing rule
// @route   DELETE /api/pricing/:id
// @access  Private/Admin
exports.deletePricing = async (req, res) => {
  try {
    const pricing = await PricingRule.findByIdAndDelete(req.params.id);

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing rule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting pricing rule',
      error: error.message
    });
  }
};
