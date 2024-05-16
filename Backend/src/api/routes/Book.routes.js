const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");

const {
    getById,
    getAllBooksForUser,
    getAllBooks,
    createBook,
} = require("../controllers/Book.controllers");

const BookRoutes = require("express").Router();

// Ruta para obtener todos los libros
BookRoutes.get('/', getAllBooks);

// Ruta para crear un libro con autenticación y subida de imagen
BookRoutes.post("/", isAuth, upload.single("image"), createBook);

// Ruta para obtener un libro por ID
BookRoutes.get("/:id", isAuth, getById);

// Ruta para obtener todos los libros del usuario autenticado
BookRoutes.get('/user/books', isAuth, getAllBooksForUser);

module.exports = BookRoutes;
