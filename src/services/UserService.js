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
    console.log(response.data);
    return response.data;
}

export const getDetailUser = async (id, access_token) => {
    console.log("check id ", id);
    console.log("check access_token ", access_token);
    const response = await axiosJWT.get(`${process.env.REACT_APP_URL_BACKEND}/user/get-detail/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    console.log("check respone ", response.data);
    return response.data;
}

export const refreshToken = async () => {
    const response = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/refresh-token`, {}, {
        withCredentials: true
    });
    return response.data;
}