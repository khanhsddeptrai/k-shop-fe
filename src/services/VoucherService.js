import axios from "axios";

export const addVoucher = async (data, access_token) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/voucher/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
};

export const getAllVoucher = async ({ page = 1, limit = 8 }, access_token) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/voucher/get-all?page=${page}&limit=${limit}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
};

export const updateVoucher = async ({ id, ...data }, access_token) => {
    const response = await axios.put(`${process.env.REACT_APP_URL_BACKEND}/voucher/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
};

export const deleteVoucher = async (id, access_token) => {
    const response = await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/voucher/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
};

export const applyVoucher = async (code, access_token) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/voucher/apply/${code}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
};