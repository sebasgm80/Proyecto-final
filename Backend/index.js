const express = require("express");
const dotenv = require("dotenv");
const { connect } = require("./src/utils/db");

// creamos el servidor web
const app = express();

// vamos a configurar dotenv para poder utilizar las variables del entorno del .env
dotenv.config();

// conectamos con la base de datos
connect();

// middleware para configurar cloudinary
const { configCloudinary } = require("./src/middleware/files.middleware");

configCloudinary();

// creamos el puerto

const PORT = process.env.PORT;

// CORS 
const cors = require("cors");
app.use(cors());

// limitamos el tamaño de las peticiones
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));

// creamos las rutas
const UserRoutes = require("./src/api/routes/User.routes");
app.use("/api/v1/users/", UserRoutes);

const BookRoutes = require("./src/api/routes/Book.routes");
app.use("/api/v1/books/", BookRoutes);



/* const CompanyRoutes = require("./src/api/routes/Company.routes");
app.use("/api/v1/Companys/", CompanyRoutes);

const MessageRoutes = require("./src/api/routes/Message.routes");
app.use("/api/v1/message/", MessageRoutes); */

// creamos las rutas de error
app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  return next(error);
});

// Error del servidor 500
app.use((error, req, res) => {
  return res
    .status(error.status || 500)
    .json(error.message || "unexpected error");
});

//Escuchamos el puerto del servidor

// Tecnologia de la cración del servidor
app.disable("x-powered-by");
app.listen(PORT, () =>
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
);
