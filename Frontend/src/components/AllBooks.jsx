import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../services/book.service';
import { purchaseBook } from '../services/message.service';
import { useAuth } from "../context/authContext";
import "./AllBooks.css";
import { Link } from 'react-router-dom';

const AllBooks = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks();

        if (Array.isArray(data)) {
          // Filtra los libros si el usuario está logueado, sino muestra todos
          const filteredBooks = user ? data.filter(book => book.userId !== user._id) : data;
          setBooks(filteredBooks);
        } else {
          throw new Error('Datos de libros no válidos.');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [user]);

  const handlePurchase = async (bookId) => {
    try {
      const response = await purchaseBook(bookId);
      const book = books.find(book => book._id === bookId);
      setMessage(`Solicitud de compra enviada para el libro: ${book.title}`);
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className="loading-message">Cargando libros...</div>;
  if (error) return <div className="error-message"><h2 className="error-title">No hay libros en la base de datos</h2></div>;
  if (message) return <div className="message">{message}</div>;

  return (
    <div className="all-books-container">
      <h1>Todos los libros</h1>
      {books.length > 0 ? (
        <ul className="books-list">
          {books.map((book) => (
            <li key={book._id} className="book-card">
              <Link to={`/book/${book._id}`}>
                {book.image && <img src={book.image} alt={book.title} />}
              </Link>
              <h2>{book.title}</h2>
              <p className="author">Autor: {book.author?.name || 'Desconocido'}</p>
              <p>Género: {book.genre || 'Desconocido'}</p>
              <p>Año: {book.year || 'Desconocido'}</p>
              <p>BookCoins: {book.Bookoins}</p>
              {user && book.userId !== user._id && (
                <button onClick={() => handlePurchase(book._id)}>Comprar</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron libros.</p>
      )}
    </div>
  );
};

export default AllBooks;
