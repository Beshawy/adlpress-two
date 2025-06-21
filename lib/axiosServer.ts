import { auth } from "@/utils/authOptions";
import axios from "axios";
import { getServerSession } from "next-auth";

// Axios Interceptor Instance
const AxiosServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api',
});

// Axios Interceptor: Request Method
AxiosServer.interceptors.request.use(
    async(config) => {
        const session = await getServerSession(auth);
        // @ts-ignore
        const accessToken = session?.accessToken;
        config.headers.Authorization = "Bearer " + accessToken
        // Can be modified request
        return config;
    },
    (error) => {
        // Handle request errors here
        console.log(error);
        // return Promise.reject(error);
    }
);

// Axios Interceptor: Response Method
AxiosServer.interceptors.response.use(
    (response) => {
        // Can be modified response
        return response;
    },
    (error) => {
        // Handle response errors here
        console.log(error);
        // return Promise.reject(error);
    }
);


export default AxiosServer