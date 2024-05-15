const Book = require("../models/Book.model");
const User = require("../models/User.model");

const calcularBookoins = (pages) => {
    return pages * 0.1; // Lógica para calcular los Bookoins
};

const createBook = async (req, res) => {
    let catchimg = req.file?.path;

    try {
        const newBook = new Book({
            ...req.body,
            image: req.file ? catchimg : "https://pic.onlinewebfonts.com/svg/img_181369.png",
            Bookoins: calcularBookoins(req.body.pages),
            userId: req.user._id,
        });

        const saveBook = await newBook.save();

        if (saveBook && req.user) {
            await User.findByIdAndUpdate(req.user._id, {
                $push: { library: saveBook._id }
            });

            return res.status(201).json(saveBook);
        } else {
            return res.status(404).json({ message: "No se ha podido guardar el libro en la base de datos" });
        }
    } catch (error) {
        req.file?.path && deleteImgCloudinary(catchimg);
        return res.status(500).json({
            message: "Error al crear el libro",
            error: error,
        });
    }
};

const getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const bookById = await Book.findById(id);
      if (bookById) {
        return res.status(200).json(bookById);
      } else {
        return res.status(404).json("no se ha encontrado el libro");
      }
    } catch (error) {
      return res.status(404).json(error.message);
    }
  };

  const getAllBooksForUser = async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(403).json({ message: "No se ha proporcionado información de autenticación válida." });
    }
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate('library');
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json(user.library);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los libros del usuario", error: error.message });
    }
};

const getAllBooks = async (req, res, next) => {
  try {
    const allBooks = await Book.find().populate('author', 'name');
    /** el find nos devuelve un array */
    if (allBooks.length > 0) {
      return res.status(200).json(allBooks);
    } else {
      return res.status(404).json("No se han encontrado libros");
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error al buscar - lanzado en el catch",
      message: error.message,
    });
  }
};



module.exports = {
    createBook,
    getById,
    getAllBooksForUser,
    getAllBooks
};
