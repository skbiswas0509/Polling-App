import axios from 'axios'
import { BASE_URL } from './apiPaths'

const axiosInstance = axios.create({
    baseURL : BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

//reqyest interceptors
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token")
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        //handle common errors globally
        if(error.response){
            //token expired or unauthorized
            console.log("Unauthorized redirecting to login")
            // redirect to login page
            window.location.href = "/login"
        }else if(error.response.status == 500) {
            console.log("Server error, PLease trye again")
    } else if(error.code == "ECONNABORTED"){
        console.log("Request timeount. please try again")
    }
    return Promise.reject(error)
    }
)

export default axiosInstance