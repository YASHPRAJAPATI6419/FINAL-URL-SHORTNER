import jwt from "jsonwebtoken";
import { findUserById } from "./user.dao.js";
export const authMiddleware = async (req, res, next) => {
    try {
        const token = 
            req.cookies.token || 
            (req.headers.authorization?.startsWith("Bearer") 
                ? req.headers.authorization.split(" ")[1] 
                : null);

        console.log("Token:", token);
        console.log("JWT Secret:", process.env.JWT_SECRET);

        if (!token || typeof token !== "string") {
            const error = new Error("Authentication token missing or malformed");
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded);

        const user = await findUserById(decoded.id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        req.userId = decoded.id;
        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        if (!err.statusCode) {
            err.statusCode = 401;
            err.message = "Invalid token";
        }
        next(err);
    }
};
