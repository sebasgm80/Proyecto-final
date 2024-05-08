const { isAuth } = require("../../middlewares/auth.middleware");
const { upload } = require("../../middlewares/files.middleware");
const {
  createGame,
  getGameById,
  getAllGames,
  getGameByTitle,
  updateGame,
  deleteGame,
} = require("../../controllers/Game.controllers");

const GameRoutes = require("express").Router();

// Aplicar isAuth a las rutas que modifican datos
GameRoutes.post("/", [isAuth, upload.single("image")], createGame); // Ruta para crear un nuevo juego
GameRoutes.get("/:id", getGameById); // Ruta para obtener un juego por ID
GameRoutes.get("/", getAllGames); // Ruta para obtener todos los juegos
GameRoutes.get("/byTitle/:title", getGameByTitle); // Ruta para obtener juegos por título
GameRoutes.patch("/:id", [isAuth, upload.single("image")], updateGame); // Ruta para actualizar un juego por ID
GameRoutes.delete("/:id", isAuth, deleteGame); // Ruta para eliminar un juego por ID

module.exports = GameRoutes;
