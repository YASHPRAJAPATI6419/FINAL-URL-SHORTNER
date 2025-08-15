import axiosInstance from "./axiosinstance";

export const loginUser = async (email, password) => {
    return await axiosInstance.post("/api/auth/login", { email, password });
}

export const registerUser = async (name, email, password) => {
    return await axiosInstance.post("/api/auth/register", { name, email, password });
}

