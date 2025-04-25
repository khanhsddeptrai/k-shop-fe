import axios from "axios";
// import { axiosJWT } from "./UserService";

export const createOrder = async (orderData, access_token) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/order/create`,
        orderData,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        });
    return response.data;
}

export const getMyorders = async (userId, access_token) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/order/my-order/${userId}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
}

export const getAllOrders = async (access_token) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/order/get-all`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
}

export const getOrderDetail = async (id, access_token) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/order/detail/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
}

export const updateOrderStatus = async (id, status, access_token) => {
    const response = await axios.put(`${process.env.REACT_APP_URL_BACKEND}/order/change-status/${id}`, status, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return response.data;
}