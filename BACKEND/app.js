import express from "express";
import dotenv from 'dotenv';
import connectDB from "./src/config/mongo.config.js"; 
import shorturlroute from "./src/routes/shortUrl.route.js";
import auth_route from "./src/routes/auth.route.js"; 
import user_route from "./src/routes/user.route.js"; // Naya route import karein
import { redirectToFullUrl } from "./src/controller/shortUrl.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { attachUser } from "./src/utils/attachUser.js";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(attachUser);

app.use('/api/auth', auth_route);
app.use('/api/url', shorturlroute);
// =========================================================================
// YEH NAYI LINE ADD KI GAYI HAI
// =========================================================================
app.use('/api/user', user_route);

app.get("/:shortCode", redirectToFullUrl); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
