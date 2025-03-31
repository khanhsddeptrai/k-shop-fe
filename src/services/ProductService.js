import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async ({ page = 1, limit = 4 } = {}) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/getAll`, {
        params: { page, limit }
    });
    return response.data;
};

export const addNewProduct = async (product) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/product/create`, product);
    return response.data;
}

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/product/delete/${id}`);
    return response.data;
}


export const getAllCategory = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/category/getAll`);
    return response.data;
}

export const updateProduct = async (product, token) => {
    const { id, ...data } = product;
    const response = await axiosJWT.put(`${process.env.REACT_APP_URL_BACKEND}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${token}`
        },
    }
    );
    return response.data;
};