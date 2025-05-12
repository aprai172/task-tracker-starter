import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-tracker-starter.onrender.com/api', // adjust if your backend URL is different
});

export default API;
