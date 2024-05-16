const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
