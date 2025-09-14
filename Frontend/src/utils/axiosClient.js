import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'http://localhost:3000',
    // i.e ab apn ko complete url likhne ki requirement nhi hai ab sidha likho /user/register

    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;
