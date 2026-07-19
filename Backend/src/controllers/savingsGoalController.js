import SavingsGoal from '../models/SavingsGoal.js';

// Helper: Format goal response
const formatGoal = (goal) => ({
  id: goal._id,
  title: goal.title,
  targetAmount: goal.targetAmount,
  savedAmount: goal.savedAmount,
  remainingAmount: Math.max(0, goal.targetAmount - goal.savedAmount),
  percentage: goal.targetAmount > 0 
    ? Math.round((goal.savedAmount / goal.targetAmount) * 100) 
    : 0,
  description: goal.description || '',
  createdAt: goal.createdAt,
});

// @desc    Get all savings goals for the logged-in user (auto-seed defaults if empty)
// @route   GET /api/savings-goals
// @access  Private
export const getSavingsGoals = async (req, res) => {
  try {
    let goals = await SavingsGoal.find({ userId: req.user._id }).sort({ createdAt: 1 });

    // Auto-seed defaults if database is empty for this user
    if (goals.length === 0) {
      return res.json([]);
    }

    res.json(goals.map(formatGoal));
  } catch (error) {
    console.error('Get Savings Goals Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// @desc    Create a new savings goal
// @route   POST /api/savings-goals
// @access  Private
export const createSavingsGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, description } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ error: 'Please provide title and targetAmount' });
    }

    const goal = new SavingsGoal({
      userId: req.user._id,
      title,
      targetAmount,
      savedAmount: savedAmount || 0,
      description: description || '',
    });

    await goal.save();
    res.status(201).json(formatGoal(goal));
  } catch (error) {
    console.error('Create Savings Goal Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// @desc    Update a savings goal (add savings or edit target)
// @route   PUT /api/savings-goals/:id
// @access  Private
export const updateSavingsGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, addAmount, description } = req.body;

    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ error: 'Savings goal not found or unauthorized' });
    }

    if (title !== undefined) goal.title = title;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (description !== undefined) goal.description = description;
    
    // Support either direct set of savedAmount or incrementing it via addAmount
    if (savedAmount !== undefined) {
      goal.savedAmount = savedAmount;
    } else if (addAmount !== undefined) {
      goal.savedAmount += Number(addAmount);
    }

    await goal.save();
    res.json(formatGoal(goal));
  } catch (error) {
    console.error('Update Savings Goal Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// @desc    Delete a savings goal
// @route   DELETE /api/savings-goals/:id
// @access  Private
export const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ error: 'Savings goal not found or unauthorized' });
    }

    res.json({ message: 'Savings goal deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Savings Goal Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};
