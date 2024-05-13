const Book = require("../models/Book.model");
const User = require("../models/User.model");

const calcularBookoins = (pages) => {
    return pages * 0.5; // Lógica para calcular los Bookoins
};

const createBook = async (req, res) => {
    let catchimg = req.file?.path;

    try {
        const newBook = new Book({
            ...req.body,
            image: req.file ? catchimg : "https://pic.onlinewebfonts.com/svg/img_181369.png",
            Bookoins: calcularBookoins(req.body.pages)
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



module.exports = {
    createBook
};
