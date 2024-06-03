// controllers/Transaction.controller.js
const Transaction = require("../models/Transaction.model");
const User = require("../models/User.model");
const Book = require("../models/Book.model");
const Wallet = require("../models/Wallet.model");
const { mongoose } = require("mongoose");

const createTransaction = async (req, res) => {
    const { bookId, amount } = req.body;
    const buyerId = req.user._id;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        const transaction = new Transaction({
            bookId: book._id,
            buyerId: buyerId,
            sellerId: book.userId,
            amount: amount,
        });

        const savedTransaction = await transaction.save();
        return res.status(201).json(savedTransaction);
    } catch (error) {
        console.error("Error al crear la transacción:", error);
        return res.status(500).json({ message: "Error al crear la transacción", error: error.message });
    }
};

const confirmTransaction = async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await Transaction.findById(id).populate('bookId');
        if (!transaction) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Transacción no encontrada" });
        }

        if (transaction.sellerId.toString() !== sellerId.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "No tienes permiso para confirmar esta transacción" });
        }

        const buyerWallet = await Wallet.findOne({ userId: transaction.buyerId }).session(session);
        const sellerWallet = await Wallet.findOne({ userId: sellerId }).session(session);

        if (buyerWallet.balance < transaction.amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Saldo insuficiente" });
        }

        buyerWallet.balance -= transaction.amount;
        sellerWallet.balance += transaction.amount;

        await buyerWallet.save({ session });
        await sellerWallet.save({ session });

        transaction.status = 'completed';
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Transacción completada" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error al confirmar la transacción:", error);
        return res.status(500).json({ message: "Error al confirmar la transacción", error: error.message });
    }
};

const rejectTransaction = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada" });
        }

        if (transaction.buyerId.toString() !== userId.toString() && transaction.sellerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "No tienes permiso para cancelar esta transacción" });
        }

        transaction.status = 'failed';
        await transaction.save();

        return res.status(200).json({ message: "Transacción cancelada" });
    } catch (error) {
        console.error("Error al cancelar la transacción:", error);
        return res.status(500).json({ message: "Error al cancelar la transacción", error: error.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ $or: [{ buyerId: req.user._id }, { sellerId: req.user._id }] })
            .populate({ path: 'bookId', select: 'title' })
            .populate({ path: 'buyerId', select: 'name' })
            .populate({ path: 'sellerId', select: 'name' });
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error al obtener las transacciones:", error);
        return res.status(500).json({ message: "Error al obtener las transacciones", error: error.message });
    }
};

module.exports = { createTransaction, confirmTransaction, rejectTransaction, getTransactions };
