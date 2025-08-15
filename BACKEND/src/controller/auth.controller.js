import { cookieOptions } from "../config/config.js";
import { register_user, login_user } from "../services/auth.service.js"; 
import { errorHandler } from "../utils/errorHandler.js";

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await register_user(name, email, password);
        res.cookie("token", user.token, cookieOptions);
        
        return res.status(201).json({
            success: true,
            message: `Registration successful! Welcome, ${name}!`,
            token: user.token,
            user: user.user
        });
    } catch (err) {
        next(err); 
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await login_user(email, password); 
        res.cookie("token", user.token, cookieOptions);
        console.log("Logged in user:", user.user.name); 

        return res.status(200).json({
            success: true,
            message: `Login successful! Welcome back, ${user.user.name}!`,
            token: user.token,
            user: user.user
        });
    } catch (err) {
        next(err);
    }
};

export const logoutUser = (req, res, next) => {
    try {
        res.clearCookie("token", cookieOptions); 
        return res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (err) {
        next(err);
    }
};