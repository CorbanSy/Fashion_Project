import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:8000/api";

const api = axios.create({
    baseURL: apiUrl,
});

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) throw new Error("No refresh token available");
    const res = await api.post(`/token/refresh/`, { refresh: refreshToken });
    localStorage.setItem(ACCESS_TOKEN, res.data.access);
    return res.data.access;
};

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token failed", err);
                // Optional: Add logic to handle refresh token failure (e.g., logout user)
            }
        }
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

export const confirmDetectedItems = (data) => {
    return api.post("/confirm-detected-items", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const registerUser = (userData) => {
    return api.post(`/user/register/`, userData);
};

export const loginUser = async (userData) => {
    const res = await api.post(`/token/`, userData);
    localStorage.setItem(ACCESS_TOKEN, res.data.access);
    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
    return res.data;
};

export const fetchFashionItems = () => {
    return api.get(`/fashion-items/`);
};

export const fetchVirtualCloset = () => {
    return api.get(`/virtual-closet/`);
};

export const predictItemDetails = (formData) => {
    return api.post("/predict-item-details", formData, {
        headers: {
            "Content-Type": "multiplart/form-data",
        },
    });
};

export default api;
