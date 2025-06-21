import axios from 'axios'
import { getSession } from 'next-auth/react'


const axiosClient = async () => {
    const session = await getSession()
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api',
        // @ts-ignore
        headers: { Authorization: `Bearer ${session?.accessToken}` },
    })
    return instance
}

export default axiosClient

