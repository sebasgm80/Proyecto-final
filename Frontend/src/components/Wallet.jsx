import React, { useState, useEffect } from 'react';
import { getUserBookoins } from '../services/user.service';
import './Wallet.css';

export const Wallet = () => {
  const [bookoins, setBookoins] = useState(0); // Estado inicial para los Bookoins
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookoins = async () => {
      try {
        const data = await getUserBookoins(); // Asume que esta función devuelve los Bookoins
        setBookoins(data.bookCoins); // Asegúrate de que la respuesta tiene esta estructura
      } catch (error) {
        setError('No se pudo cargar los Bookoins.');
        console.error('Error al cargar los Bookoins:', error);
      }
    };

    fetchBookoins();
  }, []);

  return (
    <div className="wallet">
      <h1>Tu Wallet</h1>
      {error ? <p>{error}</p> : <p>Tienes {bookoins} Bookoins.</p>}
    </div>
  );
};

