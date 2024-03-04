import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Authorization: JSON.parse(localStorage.getItem('loggedInUser'))?.Access_Token,
  },
});

export default API;
