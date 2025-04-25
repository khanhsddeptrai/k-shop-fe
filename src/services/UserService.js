import axios from "axios";
export const axiosJWT = axios.create();

export const loginUser = async (data) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-in`, data, {
        withCredentials: true
    });
    return response.data;
};

export const signupUser = async (data) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-up`, data);
    return response.data;
}

export const getAllUser = async ({ page = 1, limit = 4 } = {}) => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/user/getAll`, {
        params: { page, limit }
    });
    return response.data;
};

export const getDetailUser = async (id, access_token) => {
    const response = await axiosJWT.get(`${process.env.REACT_APP_URL_BACKEND}/user/get-detail/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return response.data;
}

export const updateUser = async (id, data, access_token) => {
    const response = await axiosJWT.put(`${process.env.REACT_APP_URL_BACKEND}/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return response.data;
}

export const addNewUser = async (product) => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/create`, product);
    return response.data;
}

export const deleteUser = async (id, access_token) => {
    const response = await axios.delete(`${process.env.REACT_APP_URL_BACKEND}/user/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return response.data;
}

export const deleteManyUser = async (data, token) => {
    const response = await axiosJWT.delete(`${process.env.REACT_APP_URL_BACKEND}/user/delete-many`, {
        headers: {
            token: `Bearer ${token}`
        },
        data: data
    });
    return response.data;
};

export const refreshToken = async () => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/refresh-token`, {}, {
        withCredentials: true
    });
    return response.data;
}

export const logOut = async () => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/log-out`, {}, {
        withCredentials: true
    });
    return response.data;
}

export const getAllRole = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/role/getAll`);
    return response.data;
}

