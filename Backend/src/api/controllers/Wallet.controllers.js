const User = require('../models/User.model'); 

exports.getBookoins = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.json({ bookCoins: user.bookCoins });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los Bookoins", error: error.message });
    }
};
