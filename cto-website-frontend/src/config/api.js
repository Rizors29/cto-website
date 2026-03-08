import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "X-APP-TOKEN": "CTO-STATIC-TOKEN-12345",
  }
});

export default api;
