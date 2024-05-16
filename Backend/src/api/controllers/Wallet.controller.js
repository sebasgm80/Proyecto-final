const Wallet = require('../models/Wallet.model');

const getWallet = async (req, res) => {
    try {
      const wallet = await Wallet.find({ userId: req.user._id });
      return res.status(200).json(wallet);
    } catch (error) {
      console.error('Error retrieving wallet:', error);
      return res.status(500).json({
        message: 'Error retrieving wallet',
        error: error.message,
      });
    }
  };

const addCoins = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;
    if (amount < 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }
    try {
        const wallet = await Wallet.findOneAndUpdate({ userId }, { $inc: { balance: amount } }, { new: true });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: "Error adding coins to wallet", error: error.message });
    }
};

const spendCoins = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;
    if (amount < 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
    }
    try {
        const wallet = await Wallet.findOneAndUpdate({ userId }, { $inc: { balance: -amount } }, { new: true });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        if (wallet.balance < 0) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: "Error spending coins from wallet", error: error.message });
    }
};

module.exports = { getWallet, addCoins, spendCoins };
