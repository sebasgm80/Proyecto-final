const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'  // Opcional, si decides mantener un registro de cada transacción
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
