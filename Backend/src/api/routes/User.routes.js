const express = require("express");
const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  register,
  login,
  update,
  deleteUser,
} = require("../controllers/User.controllers");

const UserRoutes = express.Router();

// Agrupar rutas de registro
UserRoutes.post("/register", upload.single("image"), (req, res) => {
  if (req.query.type === 'largo') {
    registerLargo(req, res);
  } else if (req.query.redirect) {
    registerWithRedirect(req, res);
  } else {
    register(req, res);
  }
});

// Rutas de autenticación y manejo de cuenta
UserRoutes.post("/login", login);

// Rutas que requieren autenticación
UserRoutes.use(isAuth);  // Aplica isAuth a todas las rutas definidas después de este punto
UserRoutes.delete("/", deleteUser); // Eliminar usuario
UserRoutes.patch("/user/update", upload.single("image"), update); // Simplificada para una sola ruta de actualización

module.exports = UserRoutes;
