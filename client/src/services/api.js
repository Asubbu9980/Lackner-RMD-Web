import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_URL,
  
});

export const calculateRmd = async (data) => {
  const res = await API.post("/rmd/calculate", data);
  return res.data;
};