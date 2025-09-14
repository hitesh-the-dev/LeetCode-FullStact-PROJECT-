import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // i.e ab apn ko complete url likhne ki requirement nhi hai ab sidha likho /user/register
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;
