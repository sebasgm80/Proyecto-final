import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookDetails, updateBook } from '../services/book.service';

const UpdateBookForm = () => {
  const { bookId } = useParams(); // Usa `bookId` para que coincida con la ruta
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    year: '',
    pages: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const data = await getBookDetails(bookId); // Usa `bookId` para la solicitud
        setBook({
          title: data.title || '',
          author: data.author || '',
          genre: data.genre || '',
          year: data.year || '',
          pages: data.pages || '',
          image: data.image || ''
        });
        setLoading(false);
      } catch (error) {
        setError('No se pudo cargar la información del libro.');
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(bookId, book); // Usa `bookId` y `book` para la actualización
      navigate('/dashboard');
    } catch (error) {
      setError('No se pudo actualizar el libro. Por favor, intenta de nuevo más tarde.');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Actualizar libro</h1>
      <input
        type="text"
        name="title"
        value={book.title}
        onChange={handleChange}
        placeholder="Título"
        required
      />
      <input
        type="text"
        name="author"
        value={book.author}
        onChange={handleChange}
        placeholder="Autor"
      />
      <input
        type="text"
        name="genre"
        value={book.genre}
        onChange={handleChange}
        placeholder="Género"
      />
      <input
        type="number"
        name="year"
        value={book.year}
        onChange={handleChange}
        placeholder="Año"
      />
      <input
        type="number"
        name="pages"
        value={book.pages}
        onChange={handleChange}
        placeholder="Páginas"
        required
      />
      <input
        type="text"
        name="image"
        value={book.image}
        onChange={handleChange}
        placeholder="URL de la imagen"
      />
      <button type="submit">Actualizar libro</button>
    </form>
  );
};

export default UpdateBookForm;
