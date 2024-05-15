const express = require("express");
const { getWallet, addCoins, spendCoins } = require("../controllers/Wallet.controller");

const WalletRoutes = express.Router();

WalletRoutes.get('/:userId', getWallet);  // Obtener la billetera de un usuario
WalletRoutes.post('/:userId/add', addCoins);  // Añadir BookCoins a la billetera
WalletRoutes.post('/:userId/spend', spendCoins);  // Gastar BookCoins

module.exports = WalletRoutes;
