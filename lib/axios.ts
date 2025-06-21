import axios from "axios";

// Axios Interceptor Instance
const AxiosApp = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api',
});

AxiosApp.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

// Axios Interceptor: Response Method
AxiosApp.interceptors.response.use(
    (response) => {
        // Can be modified response
        return response;
    },
    (error) => {
        // Handle response errors here
        return Promise.reject(error);
    }
);


export default AxiosApp