import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const apiUrl = "/choreo-apis/fashionproject/backend/v1"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export const getOutfitRecommendations = (outfitId) => {
    return api.get(`/api/outfits/${outfitId}/recommendations/`)
};

export const uploadOutfit = (formData) => {
    return api.post("/api/outfits/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const registerUser = (userData) => {
    return api.post(`/api/user/register/`, userData)
}

export default api