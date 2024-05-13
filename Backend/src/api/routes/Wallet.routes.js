const express = require('express');
const walletController = require('../controllers/');
const { isAuth } = require('../../middleware/auth.middleware');  


const WalletRoutes = express.Router();

WalletRoutes.get('/bookoins', isAuth, walletController.getBookoins);

module.exports = WalletRoutes;
