const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");

const {
    getById,
    getAll,
    getByName,
    update,
    deleteBook,
    createBook,
} = require("../controllers/Book.controllers");

const BookRoutes = require("express").Router();

BookRoutes.post("/", isAuth, upload.single("image"), createBook);


module.exports = BookRoutes;
