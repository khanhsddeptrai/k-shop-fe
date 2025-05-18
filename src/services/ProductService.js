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
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        return { status: 'error', message: error.message };
    }
};

export const addNewProduct = async (product) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/product/create`, product);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        return { status: 'error', message: error.message };
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/product/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        return { status: 'error', message: error.message };
    }
};

export const deleteManyProduct = async (data, token) => {
    try {
        const response = await axiosJWT.delete(`${process.env.REACT_APP_URL_BACKEND}/product/delete-many`, {
            headers: {
                token: `Bearer ${token}`
            },
            data: data
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa nhiều sản phẩm:', error);
        return { status: 'error', message: error.message };
    }
};

export const updateProduct = async (product, token) => {
    try {
        const { id, ...data } = product;
        const response = await axiosJWT.put(`${process.env.REACT_APP_URL_BACKEND}/product/update/${id}`, data, {
            headers: {
                token: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        return { status: 'error', message: error.message };
    }
};

export const searchProductSuggestions = async (search) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/search-suggestion`, {
            params: { search, limit: 5 },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy gợi ý tìm kiếm:', error);
        return { data: [] };
    }
};

export const getProductsByCategory = async ({ categoryId, limit = 4, excludeId }) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/recommend-product`, {
            params: { categoryId, limit, excludeId },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
        return { status: 'error', message: error.message };
    }
};

export const getSimilarProducts = async ({ productId, limit }) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/similar-products`, {
            params: { productId, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm tương đồng:', error);
        return { status: 'error', message: error.message };
    }
};