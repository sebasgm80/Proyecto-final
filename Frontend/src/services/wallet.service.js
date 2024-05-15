import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/wallet';

export const getWallet = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

export const addCoins = async (userId, amount) => {
  const response = await axios.post(`${API_URL}/${userId}/add`, { amount });
  return response.data;
};

export const spendCoins = async (userId, amount) => {
  const response = await axios.post(`${API_URL}/${userId}/spend`, { amount });
  return response.data;
};
