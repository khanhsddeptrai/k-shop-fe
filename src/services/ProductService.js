import axios from "axios";

export const getAllProduct = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/getAll`);
    return response.data;
}