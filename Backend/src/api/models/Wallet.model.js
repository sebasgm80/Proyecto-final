const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 100  // Cada nueva billetera comienza con 100 BookCoins
  },
  transactions: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    type: {
      type: String,
      enum: ['credit', 'debit'] // 'credit' para ingresos, 'debit' para gastos
    },
    description: String
  }]
});

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
