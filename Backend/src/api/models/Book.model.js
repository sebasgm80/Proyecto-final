const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: false,
    },
    genre: {
        type: String,
        required: false,
    },
    year: {
        type: Number,
        required: false,
    },
    pages: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    Bookoins: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
}, { timestamps: true });

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
