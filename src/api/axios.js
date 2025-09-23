import axios from "axios";

const API = axios.create({
  baseURL: "https://tranquility.backend.ams.ayata.com.np/",
});

// Attach token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const organization = localStorage.getItem("organization")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if(organization){    
  config.headers['x-organization']=organization
  }
 return config;
});

export default API;
