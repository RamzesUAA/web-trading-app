import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 3600,
});

console.log(process.env.REACT_APP_API_URL)
instance.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default instance;
