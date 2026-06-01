import axios from "axios";

const API = axios.create({
  baseURL: "https://resume-screening-2-mhvq.onrender.com",
});

export default API;