const { isAuth } = require("../../middleware/auth.middleware");
const express = require("express");
const { getMessages, purchaseBook, confirmPurchase } = require("../controllers/Message.controller");

const MessageRoutes = express.Router();

// Obtener las solicitudes de compra
MessageRoutes.get('/user/messages', isAuth, getMessages);

// Comprar un libro
MessageRoutes.post("/:id/purchase", isAuth, purchaseBook);

// Confirmar compra de un libro
MessageRoutes.post('/:id/confirm', isAuth, confirmPurchase);

module.exports = MessageRoutes;
