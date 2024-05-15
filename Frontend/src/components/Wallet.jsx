import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { getWallet, addCoins, spendCoins } from '../services/wallet.service';

export const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await getWallet(user._id);
        setWallet(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [user]);

  const handleAddCoins = async () => {
    try {
      const updatedWallet = await addCoins(user._id, amount);
      setWallet(updatedWallet);
      setAmount(0);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSpendCoins = async () => {
    try {
      const updatedWallet = await spendCoins(user._id, amount);
      setWallet(updatedWallet);
      setAmount(0);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Wallet</h1>
      {wallet ? (
        <div>
          <p>Balance: {wallet.balance}</p>
          <ul>
            {wallet.transactions.map((transaction, index) => (
              <li key={index}>
                {transaction.date}: {transaction.amount} ({transaction.type})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No wallet found</p>
      )}
    </div>
  );
};

