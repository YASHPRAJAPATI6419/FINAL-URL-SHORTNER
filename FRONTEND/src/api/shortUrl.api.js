import axiosInstance from "./axiosinstance";

export const createShortUrl =async (originalUrl) =>{
    return await axiosInstance.post("/api/create", { url: originalUrl });
}