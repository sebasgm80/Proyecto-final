// routes/Transaction.routes.js
const { isAuth } = require("../../middleware/auth.middleware");
const express = require("express");
const { createTransaction, confirmTransaction, rejectTransaction, getTransactions } = require("../controllers/Transaction.controller");

const TransactionRoutes = express.Router();

// Crear una nueva transacción
TransactionRoutes.post("/", isAuth, createTransaction);

// Confirmar una transacción
TransactionRoutes.post("/:id/confirm", isAuth, confirmTransaction);

// Cancelar una transacción
TransactionRoutes.post("/:id/reject", isAuth, rejectTransaction);

// Obtener todas las transacciones del usuario
TransactionRoutes.get("/", isAuth, getTransactions);

module.exports = TransactionRoutes;
