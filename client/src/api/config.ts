import axios from "axios";
import { AxiosInstance } from "axios";


export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/",

})



