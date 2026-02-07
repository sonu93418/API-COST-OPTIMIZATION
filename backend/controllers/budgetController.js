const Budget = require('../models/Budget');
const APILog = require('../models/ApiLog');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ providerName: 1 });
    
    res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching budgets',
      error: error.message
    });
  }
};

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private/Admin
exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(req.body);

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Budget already exists for this provider and period'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating budget',
      error: error.message
    });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private/Admin
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating budget',
      error: error.message
    });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private/Admin
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting budget',
      error: error.message
    });
  }
};

// @desc    Update current spend for all budgets
// @route   POST /api/budgets/update-spend
// @access  Private/Admin
exports.updateCurrentSpend = async (req, res) => {
  try {
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const budgets = await Budget.find({ 
      isActive: true,
      period: currentPeriod
    });

    for (const budget of budgets) {
      const spendResult = await APILog.aggregate([
        {
          $match: {
            providerName: budget.providerName,
            createdAt: { $gte: monthStart }
          }
        },
        {
          $group: {
            _id: null,
            totalCost: { $sum: '$calculatedCost' }
          }
        }
      ]);

      const currentSpend = spendResult[0]?.totalCost || 0;
      budget.currentSpend = currentSpend;
      await budget.save();
    }

    res.status(200).json({
      success: true,
      message: 'Budget spend updated successfully',
      count: budgets.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating budget spend',
      error: error.message
    });
  }
};
