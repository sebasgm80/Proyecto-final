import React, { useEffect, useState } from 'react';
import { getUserBooks } from '../services/book.service';
import "./BookList.css";
import { Link } from 'react-router-dom';

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const booksData = await getUserBooks();
                if (booksData.length === 0) {
                    setError('No tienes libros en tu biblioteca aún.'); // Caso específico para biblioteca vacía
                } else {
                    setBooks(booksData);
                }
            } catch (error) {
                setError('Error en la obtención de libros. Por favor, intenta de nuevo más tarde.');
                console.error('Error en la obtención de libros:', error);
            }
            setLoading(false);
        };

        fetchBooks();
    }, []);

    if (loading) return <div>Cargando libros...</div>;
    if (error) return <div>{error}</div>; // Mostrar mensajes de error o biblioteca vacía

    return (
        <div className="books-container">
    {books.map(book => (
        <div className="book-card" key={book._id}>
            <Link to={`/book/${book._id}`}>
            <img src={book.image || 'path/to/default-image.jpg'} alt={`Portada de ${book.title}`} />
            </Link>
            <div className="book-info">
                <h3>{book.title}</h3>
                <p>Bookoins: {book.Bookoins}</p>
            </div>
        </div>
    ))}
</div>

    );
};

export default BooksList;
