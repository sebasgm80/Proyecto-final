const { isAuth } = require("../../middleware/auth.middleware");
const express = require("express");
const { getWallet } = require("../controllers/Wallet.controller");

const WalletRoutes = express.Router();

// Obtener la wallet del usuario
WalletRoutes.get('/', isAuth, getWallet);

module.exports = WalletRoutes;
