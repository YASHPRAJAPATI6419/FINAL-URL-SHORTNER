import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../dao/user.dao.js";
import { cookieOptions } from "../config/config.js";

export const register_user = async (name, email, password) => {
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            const error = new Error("User already exists with this email");
            error.statusCode = 400;
            throw error;
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await createUser(name, email, hashedPassword);
        
        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
        );
        
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gravatar: user.gravatar
            }
        };
    } catch (err) {
        throw err;
    }
};

export const login_user = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }
        console.log(user)
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }
        console.log(isPasswordValid)
        
        const token = jsonwebtoken.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
        );
        return {
            token,  
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gravatar: user.gravatar
            }
        };
    } catch (err) {
        throw err;
    }
}
