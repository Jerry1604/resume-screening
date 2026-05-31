import axios from "axios";

const API = axios.create({
  baseURL: "https://resume-screening-1-eao1.onrender.com",
});

export default API;