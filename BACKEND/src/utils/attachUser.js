
import jwt from "jsonwebtoken";
import { findUserById } from "../dao/user.dao.js";

export const attachUser = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("token from back",token)

    if (!token) {
        console.log('No token, skipping user attachment.');
        console.log('--- attachUser middleware END ---');
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('JWT Decoded Payload:', decoded);

        if (!decoded || !decoded.id) {
            console.log('Decoded token invalid or missing ID.');
            console.log('--- attachUser middleware END ---');
            return next();
        }

        const user = await findUserById(decoded.id);
        console.log('User found by ID from DB:', user ? user._id : 'User NOT Found');

        if (!user) {
            console.log('User not found in DB for the token ID.');
            console.log('--- attachUser middleware END ---');
            return next();
        }

        req.user = user;
        console.log('req.user set successfully with user ID:', req.user._id);
        console.log('--- attachUser middleware END ---');
        next();
    } catch (err) {
        console.error('ERROR in attachUser middleware:', err.message);
        console.log('--- attachUser middleware END ---');
        next(); 
    }
};