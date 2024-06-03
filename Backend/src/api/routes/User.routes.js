const express = require("express");
const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  register,
  login,
  update,
  deleteUser,
  getUsersWithBooks,
} = require("../controllers/User.controllers");

const UserRoutes = express.Router();

// Rutas de registro
UserRoutes.post("/register", upload.single("image"), register);

// Rutas de autenticación
UserRoutes.post("/login", login);

// Rutas que requieren autenticación
UserRoutes.use(isAuth);
UserRoutes.delete("/", deleteUser); // Eliminar usuario
UserRoutes.patch("/user/update", upload.single("image"), update); // Actualizar usuario

// Obtener usuarios con sus libros
UserRoutes.get("/with-books", isAuth, getUsersWithBooks);

module.exports = UserRoutes;
