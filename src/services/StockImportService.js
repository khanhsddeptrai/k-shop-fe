import axios from "axios";
import { axiosJWT } from "./UserService";

export const addStockImport = async (data) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/stock-import/create`, data);
    return response.data;
}

export const getAllStockImport = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/stock-import/get-all`);
    return response.data;
}
