import React, { useEffect, useState } from 'react';
import { getMessages, confirmPurchase } from '../services/message.service';
import "./Messages.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleConfirm = async (messageId) => {
    try {
      const response = await confirmPurchase(messageId);
      setConfirmation(`Compra confirmada para el libro: ${response.bookTitle}`);
      // Remover el mensaje confirmado de la lista
      setMessages(messages.filter(message => message._id !== messageId));
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className="loading-message">Cargando mensajes...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (confirmation) return <div className="confirmation-message">{confirmation}</div>;

  return (
    <div className="messages-container">
      <h1>Solicitudes de Compra</h1>
      {messages.length > 0 ? (
        <ul className="messages-list">
          {messages.map((msg) => (
            <li key={msg._id} className="message-card">
              <h2>{msg.bookTitle}</h2>
              <p>Solicitado por: {msg.buyerName}</p>
              <button onClick={() => handleConfirm(msg._id)}>Confirmar Compra</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes solicitudes de compra pendientes.</p>
      )}
    </div>
  );
};

export default Messages;
