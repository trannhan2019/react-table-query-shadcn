import axios from "axios";

const baseURL = "https://api-ecom.duthanhduoc.com";
const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosClient;
