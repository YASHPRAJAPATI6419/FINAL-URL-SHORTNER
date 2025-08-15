import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  } 
});

export default axiosInstance;
