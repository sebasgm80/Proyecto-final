const Message = require("../models/Message.model");
const Book = require("../models/Book.model");
const User = require("../models/User.model");
const Wallet = require("../models/Wallet.model");
const logger = require("../../../logger");
const { mongoose } = require("mongoose");


const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sellerId: req.user._id, status: 'pending' })
      .populate('bookId', 'title')
      .populate('buyerId', 'name');
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return res.status(500).json({
      error: 'Error retrieving messages',
      message: error.message,
    });
  }
};

const purchaseBook = async (req, res) => {
  const { id } = req.params;
  const buyerId = req.user._id;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    const message = new Message({
      bookId: book._id,
      buyerId: buyerId,
      sellerId: book.userId,
    });

    await message.save();

    return res.status(200).json({ message: 'Solicitud de compra enviada' });
  } catch (error) {
    console.error('Error al realizar la compra:', error);
    return res.status(500).json({
      error: 'Error al realizar la compra',
      message: error.message,
    });
  }
};

const confirmPurchase = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const message = await Message.findById(id).populate('bookId');
    if (!message) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (message.sellerId.toString() !== sellerId.toString()) {
      await session.abortTransaction();
      session.endSession();
      logger.error('No tienes permiso para confirmar la compra de este libro');
      return res.status(403).json({ message: 'No tienes permiso para confirmar esta compra' });
    }

    const buyer = await User.findById(message.buyerId);
    const sellerWallet = await Wallet.findOne({ userId: sellerId });
    const buyerWallet = await Wallet.findOne({ userId: buyer._id });

    if (buyerWallet.balance < message.bookId.Bookoins) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'El comprador no tiene suficientes BookCoins' });
    }

    buyerWallet.balance -= message.bookId.Bookoins;
    sellerWallet.balance += message.bookId.Bookoins;

    await buyerWallet.save({ session });
    await sellerWallet.save({ session });

    message.bookId.userId = buyer._id;
    await message.bookId.save({ session });

    message.status = 'accepted';
    await message.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'Compra confirmada' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error al confirmar la compra:', error);
    return res.status(500).json({
      error: 'Error al confirmar la compra',
      message: error.message,
    });
  }
};

module.exports = {
  getMessages,
  purchaseBook,
  confirmPurchase,
};
