import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:8000/api";

const api = axios.create({
    baseURL: apiUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getOutfitRecommendations = (outfitId) => {
    return api.get(`/outfits/${outfitId}/recommendations/`);
};

export const uploadOutfit = (formData) => {
    return api.post("/outfits/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const uploadClothingItem = (formData) => {
    return api.post("/virtual-closet/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const registerUser = (userData) => {
    return api.post(`/user/register/`, userData);
};

export const loginUser = (userData) => {
    return api.post(`/token/`, userData);
};

export const fetchFashionItems = () => {
    return api.get(`/fashion-items/`);
};

export const fetchVirtualCloset = () => {
    return api.get(`/virtual-closet/`);
};

export default api;
