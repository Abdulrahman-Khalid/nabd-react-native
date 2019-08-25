import axios from 'axios';

export default axios.create({
  baseURL: 'https://127.0.0.1/api/',
  responseType: 'json'
});
