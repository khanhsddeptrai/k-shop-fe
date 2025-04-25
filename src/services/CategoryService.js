import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllCategory = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/category/getAll`);
    return response.data;
}

export const addNewCategory = async (category) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/category/create`, category);
    return response.data;
}

export const updateCategory = async (product, token) => {
    const { id, ...data } = product;
    const response = await axiosJWT.put(`${process.env.REACT_APP_URL_BACKEND}/category/update/${id}`, data, {
        headers: {
            token: `Bearer ${token}`
        },
    });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/category/delete/${id}`);
    return response.data;
}

