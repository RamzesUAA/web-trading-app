import axios from './axiosConfig';

export const getOrderBook = async () => {
  try {
    const response = await axios.get('/orderbook');
    return response.data;
  } catch (error) {
    throw new Error('Erorr:', error);
  }
};