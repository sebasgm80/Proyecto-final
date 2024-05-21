const { isAuth } = require("../../middleware/auth.middleware");
const express = require("express");
const { getMessages, purchaseBook, confirmPurchase, rejectPurchase } = require("../controllers/Message.controller");

const MessageRoutes = express.Router();

// Obtener las solicitudes de compra
MessageRoutes.get('/user/messages', isAuth, getMessages);

// Comprar un libro
MessageRoutes.post("/:id/purchase", isAuth, purchaseBook);

// Confirmar compra de un libro
MessageRoutes.post('/:id/confirm', isAuth, confirmPurchase);

// Rechazar compra de un libro
MessageRoutes.post('/:id/reject', isAuth, rejectPurchase);

module.exports = MessageRoutes;
