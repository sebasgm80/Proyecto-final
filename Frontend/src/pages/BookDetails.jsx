import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBookDetails } from '../services/book.service';


export const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const data = await getBookDetails(bookId);
        setBook(data);
        setLoading(false);
      } catch (error) {
        setError('No se pudo cargar la información del libro.');
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <img src={book.image} alt={book.title} />
      <p>{book.Bookoins}</p>
      <Link to="/dashboard"><button>Dashborad</button></Link>
      <Link to="/books"><button>Todos los libros</button></Link>
    </div>
  );
};


