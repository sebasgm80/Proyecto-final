const express = require("express");
const dotenv = require("dotenv");
const { connect } = require("./src/utils/db");
const cors = require("cors");
const logger = require("./logger");
dotenv.config();
connect();

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));
app.use(cors());

// Configurar Cloudinary
const { configCloudinary } = require("./src/middleware/files.middleware");
configCloudinary();

// Rutas
const UserRoutes = require("./src/api/routes/User.routes");
const BookRoutes = require("./src/api/routes/Book.routes");
const MessageRoutes = require("./src/api/routes/Message.routes");
const WalletRoutes = require("./src/api/routes/Wallet.routes");
const TransactionRoutes = require("./src/api/routes/Transaction.routes");



app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/books", BookRoutes);
app.use("/api/v1/messages", MessageRoutes);
app.use("/api/v1/wallet", WalletRoutes);
app.use("/api/v1/transactions", TransactionRoutes);

// Rutas de error
app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  logger.error(error.message);
  return next(error);
});

// Error del servidor 500
app.use((error, req, res, next) => {
  logger.error(`Error: ${error.message}`); // Registrar el error
  return res.status(error.status || 500).json({ message: error.message || "Unexpected error" });
});

app.disable("x-powered-by");
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
