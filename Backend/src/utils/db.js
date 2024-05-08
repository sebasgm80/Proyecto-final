//!------------------------------------------------------------------------------
//?----------------------CONEXION CON LA base de datos MONGO DB------------------
//!------------------------------------------------------------------------------

// tenemos que traernos dotenv porque tenmos la url que no queremos que se comparta publicamente
const dotenv = require("dotenv");
dotenv.config();

// Nos traemos la libreria mongoose que es quien va a controlar la DB: MONGO DB
const mongoose = require("mongoose");

// nos traemos la MONGO_URI del .env
const MONGO_URI = process.env.MONGO_URI;

/// hacemos la funcion que se exporta y luego importa en el index que va conectar con Mongo

const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI);

    // AHORA NOS VAMOS A TRAER EL HOST  y el NAME  de la DB --

    const { name, host } = db.connection;

    console.log(
      `✅ Se ha conectado a la base de datos ${name} exitosamente en el host ${host}`
    );
  } catch (error) {
    console.log("❌ No se ha conectado a la base de datos", error.message);
  }
};

module.exports = { connect };
