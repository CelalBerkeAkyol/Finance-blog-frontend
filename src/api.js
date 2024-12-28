// src/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/blog", // Temel URL
  withCredentials: true, // Cookie gönderimi için gerekli
});

// Artık token'ı başlık olarak eklemiyoruz, cookie kullanılacak
export default instance;
