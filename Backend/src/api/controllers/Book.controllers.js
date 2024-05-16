const Book = require("../models/Book.model");
const User = require("../models/User.model");
const { deleteImgCloudinary } = require("../../middleware/files.middleware");

const calcularBookoins = (pages) => {
    return pages * 0.1; // Lógica para calcular los Bookoins
};

const createBook = async (req, res) => {
    const catchimg = req.file?.path;

    try {
        const newBook = new Book({
            ...req.body,
            image: req.file ? catchimg : "https://pic.onlinewebfonts.com/svg/img_181369.png",
            Bookoins: calcularBookoins(req.body.pages),
            userId: req.user._id,
        });

        const savedBook = await newBook.save();

        if (savedBook) {
            await User.findByIdAndUpdate(req.user._id, {
                $push: { library: savedBook._id }
            });
            return res.status(201).json(savedBook);
        } else {
            return res.status(404).json({ message: "No se ha podido guardar el libro en la base de datos" });
        }
    } catch (error) {
        if (req.file?.path) deleteImgCloudinary(catchimg);
        return res.status(500).json({
            message: "Error al crear el libro",
            error: error.message,
        });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const bookById = await Book.findById(id);
        if (bookById) {
            return res.status(200).json(bookById);
        } else {
            return res.status(404).json("No se ha encontrado el libro");
        }
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const getAllBooksForUser = async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(403).json({ message: "No se ha proporcionado información de autenticación válida." });
    }

    try {
        const user = await User.findById(req.user._id).populate('library');
        if (user) {
            return res.status(200).json(user.library);
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los libros del usuario", error: error.message });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const allBooks = await Book.find().populate('author', 'name');
        if (allBooks.length > 0) {
            return res.status(200).json(allBooks);
        } else {
            return res.status(404).json("No se han encontrado libros");
        }
    } catch (error) {
        return res.status(500).json({
            error: "Error al buscar libros",
            message: error.message,
        });
    }
};

module.exports = {
    createBook,
    getById,
    getAllBooksForUser,
    getAllBooks,
};
