import ShortUrl from "../models/shortUrl.model.js"; 
import mongoose from "mongoose";

export const saveshortUrl = async (short_url, full_url, userId = null, expiresAt = null) => {
    try {
        const newShortUrl = new ShortUrl({
            full_url: full_url,
            short_url: short_url,
        });

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            newShortUrl.user = new mongoose.Types.ObjectId(userId.toString());
        }

        if (expiresAt) {
            newShortUrl.expiresAt = expiresAt;
        }

        const savedUrl = await newShortUrl.save();
        return savedUrl;
    } catch (err) {
        throw err;
    }
};

export const getshortUrl = async (short_url) => {
    try {
        return await ShortUrl.findOne({ short_url });
    } catch (err) {
        throw err;
    }
};

export const getcustomshortUrl = async (slug) => {
    try {
        return await ShortUrl.findOne({ short_url: slug });
    } catch (err) {
        throw err;
    }
};