import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async ({ page = 1, limit = 4, categoryId, search = '' } = {}) => {
    try {
        const params = { page, limit };
        if (categoryId) params.categoryId = categoryId;
        if (search) params.filter = `name:${search}`;

        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/getAll`, {
            params,
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        return { status: 'error', message: error.message };
    }
};

export const getDetailProduct = async (id) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/detail/${id}`)
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

export const deleteManyProduct = async (data, token) => {
    const response = await axiosJWT.delete(`${process.env.REACT_APP_URL_BACKEND}/product/delete-many`, {
        headers: {
            token: `Bearer ${token}`
        },
        data: data
    });
    return response.data;
};

export const updateProduct = async (product, token) => {
    const { id, ...data } = product;
    const response = await axiosJWT.put(`${process.env.REACT_APP_URL_BACKEND}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${token}`
        },
    });
    return response.data;
};

export const searchProductSuggestions = async (search) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/search-suggestion`, {
            params: { search, limit: 5 }, // Giới hạn 5 gợi ý
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product suggestions:', error);
        return { data: [] };
    }
};