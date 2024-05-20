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
      image: req.file
        ? catchimg
        : "https://res.cloudinary.com/dsurhcayl/image/upload/v1716139467/cover-placeholder_wsv6qo.jpg",
      Bookoins: calcularBookoins(req.body.pages),
      userId: req.user._id,
    });

    const savedBook = await newBook.save();

    if (savedBook) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { library: savedBook._id },
      });
      return res.status(201).json(savedBook);
    } else {
      return res
        .status(404)
        .json({
          message: "No se ha podido guardar el libro en la base de datos",
        });
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
    return res
      .status(403)
      .json({
        message: "No se ha proporcionado información de autenticación válida.",
      });
  }

  try {
    const user = await User.findById(req.user._id).populate("library");
    if (user) {
      return res.status(200).json(user.library);
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al obtener los libros del usuario",
        error: error.message,
      });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find().populate("author", "name");
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

const updateBook = async (req, res) => {
  await Book.syncIndexes();
  let catchImg = req.file?.path;
  try {
    const { id } = req.params;
    const bookById = await Book.findById(id);
    if (bookById) {
      const oldImg = bookById.image;

      const customBody = {
        _id: bookById._id,
        image: req.file?.path ? catchImg : oldImg,
        title: req.body?.title ? req.body?.title : bookById.title,
        author: req.body?.author ? req.body?.author : bookById.author,
        genre: req.body?.genre ? req.body?.genre : bookById.genre,
        year: req.body?.year ? req.body?.year : bookById.year,
        pages: req.body?.pages ? req.body?.pages : bookById.pages,
        Bookoins: req.body?.pages ? calcularBookoins(req.body.pages) : bookById.Bookoins
      };

      try {
        await Book.findByIdAndUpdate(id, customBody);
        if (req.file?.path) {
          deleteImgCloudinary(oldImg);
        }
        return res.status(200).json(customBody);
      } catch (error) {
        if (req.file?.path) {
          deleteImgCloudinary(catchImg);
        }
        return res.status(500).json({
          message: "Error al actualizar el libro",
          error: error.message,
        });
      }
    } else {
      if (req.file?.path) {
        deleteImgCloudinary(catchImg);
      }
      return res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el libro",
      error: error.message,
    });
  }
};



const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const bookToDelete = await Book.findById(id);
    if (!bookToDelete) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    await Book.findByIdAndDelete(id);

    if (bookToDelete.image) {
      await deleteImgCloudinary(bookToDelete.image);
    }

    await User.findByIdAndUpdate(bookToDelete.userId, {
      $pull: { library: id }
    });

    return res.status(200).json({ message: "Libro eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el libro",
      error: error.message,
    });
  }
};


module.exports = {
  createBook,
  getById,
  getAllBooksForUser,
  getAllBooks,
  updateBook,
  deleteBook,
};
