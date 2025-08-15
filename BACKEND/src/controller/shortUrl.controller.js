import { createShortUrlEntry, getFullUrlAndIncrementClicks, getUserShortenedUrls, createProtectedShortUrlEntry, createLocationBasedShortUrlEntry } from '../services/shortUrl.service.js';
import ShortUrl from '../models/shortUrl.model.js';
import { generateNanoId } from "../utils/helper.js";
import QRCode from 'qrcode';
import bcrypt from 'bcrypt';
import path from 'path';
import geoip from 'geoip-lite';
import mongoose from 'mongoose';

const getUserCountryCode = (req) => {
    if (req.headers['x-country-code']) {
        return req.headers['x-country-code'];
    }
    const ip = req.ip;
    if (ip === '::1' || ip === '127.0.0.1') {
        return 'IN';
    }
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'US';
};


export const createAndShortenUrl = async (req, res, next) => {
    try {
        const { fullUrl, customAlias, expiresAt } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!fullUrl) {
            return res.status(400).json({ message: 'Full URL is required.' });
        }

        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        let generatedShortUrl;
        let qrCodeDataUrl = null;

        const potentialShortCode = customAlias || generateNanoId(7);
        generatedShortUrl = `${appUrl}/${potentialShortCode}`;

        const linkType = customAlias ? 'custom' : 'standard';

        try {
            qrCodeDataUrl = await QRCode.toDataURL(generatedShortUrl, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000FF',
                    light: '#FFFFFFFF'
                }
            });

        } catch (qrError) {
            console.error('Error generating QR code for URL:', generatedShortUrl, qrError);
        }
        const newUrlEntry = await createShortUrlEntry(fullUrl, customAlias, userId, expiresAt, qrCodeDataUrl, linkType); // <-- ADDED linkType

        generatedShortUrl = `${appUrl}/${newUrlEntry.short_url}`;

        res.status(201).json({
            message: 'URL successfully shortened! You can now view it in My URLs.',
            shortUrl: generatedShortUrl,
            originalUrl: newUrlEntry.full_url,
            qrCodeDataUrl: newUrlEntry.qrCodeDataUrl,
        });
    } catch (error) {
        next(error);
    }
};

export const createProtectedAndShortenUrl = async (req, res, next) => {
    try {
        const { fullUrl, customAlias, password, expiresAt } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!fullUrl || !password) {
            return res.status(400).json({ message: 'Full URL and password are required.' });
        }

        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        let generatedShortUrl;
        let qrCodeDataUrl = null;

        const potentialShortCode = customAlias || generateNanoId(7);
        generatedShortUrl = `${appUrl}/${potentialShortCode}`;

        try {
            qrCodeDataUrl = await QRCode.toDataURL(generatedShortUrl, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000FF',
                    light: '#FFFFFFFF'
                }
            });
        } catch (qrError) {
            console.error('Error generating QR code for URL:', generatedShortUrl, qrError);
        }

        const newUrlEntry = await createProtectedShortUrlEntry(fullUrl, customAlias, userId, expiresAt, qrCodeDataUrl, password, 'protected'); // <-- ADDED 'protected' type

        generatedShortUrl = `${appUrl}/${newUrlEntry.short_url}`;

        res.status(201).json({
            message: 'Protected URL successfully shortened! You can now view it in My URLs.',
            shortUrl: generatedShortUrl,
            originalUrl: newUrlEntry.full_url,
            qrCodeDataUrl: newUrlEntry.qrCodeDataUrl,
        });

    } catch (error) {
        next(error);
    }
};

export const createLocationBasedLink = async (req, res, next) => {
    try {
        const { fullUrl, customAlias, geoRules, defaultGeoUrl } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!fullUrl) {
            return res.status(400).json({ message: 'Base URL is required.' });
        }
        if (!geoRules || !Array.isArray(geoRules) || geoRules.length === 0) {
            return res.status(400).json({ message: 'At least one geo-redirection rule is required.' });
        }

        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        let generatedShortUrl;
        let qrCodeDataUrl = null;

        const potentialShortCode = customAlias || generateNanoId(7);
        generatedShortUrl = `${appUrl}/${potentialShortCode}`;

        try {
            qrCodeDataUrl = await QRCode.toDataURL(generatedShortUrl, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000FF',
                    light: '#FFFFFFFF'
                }
            });
        } catch (qrError) {
            console.error('Error generating QR code for URL:', generatedShortUrl, qrError);
        }

        const newUrlEntry = await createLocationBasedShortUrlEntry(fullUrl, customAlias, userId, geoRules, defaultGeoUrl, qrCodeDataUrl, 'location'); // <-- ADDED 'location' type

        generatedShortUrl = `${appUrl}/${newUrlEntry.short_url}`;

        res.status(201).json({
            message: 'Location-based URL successfully shortened! You can now view it in My URLs.',
            shortUrl: generatedShortUrl,
            originalUrl: newUrlEntry.full_url,
            qrCodeDataUrl: newUrlEntry.qrCodeDataUrl,
        });

    } catch (error) {
        next(error);
    }
};


export const redirectToFullUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const password = req.method === 'POST' ? req.body.password : undefined;

        const urlEntry = await ShortUrl.findOne({ short_url: shortCode });

        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found.' });
        }

        if (urlEntry.expiresAt && urlEntry.expiresAt <= new Date()) {
            return res.status(410).json({ message: 'This short URL has expired.' });
        }

        const userCountryCode = getUserCountryCode(req);
        
        urlEntry.clicks++;
        urlEntry.clickDetails.push({ country: userCountryCode });
        await urlEntry.save();

        if (urlEntry.geo_rules && urlEntry.geo_rules.length > 0) {
            let redirectUrlFound = null;
            for (const rule of urlEntry.geo_rules) {
                if (rule.countryCode.toUpperCase() === userCountryCode.toUpperCase()) {
                    redirectUrlFound = rule.redirectUrl;
                    break;
                }
            }
            const finalRedirectUrl = redirectUrlFound || urlEntry.defaultGeoUrl || urlEntry.full_url;
            return res.redirect(finalRedirectUrl);
        }

        if (urlEntry.password) {
            if (req.method === 'GET' || !password) {
                return res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Protected Link</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style> body { font-family: 'Inter', sans-serif; } </style>
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center h-screen">
                        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                            <div>
                                <h2 class="text-2xl font-bold text-center text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-8 w-8 text-yellow-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 002 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                                    </svg>
                                    Link is Protected
                                </h2>
                                <p class="mt-2 text-center text-sm text-gray-600">Please enter the password to continue.</p>
                            </div>
                            <form id="passwordForm" class="space-y-6">
                                <div>
                                    <label for="password" class="sr-only">Password</label>
                                    <input id="password" name="password" type="password" required class="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm" placeholder="Enter password">
                                </div>
                                <p id="errorMessage" class="text-sm text-red-600 text-center" style="display: none;"></p>
                                <div>
                                    <button type="submit" id="submitButton" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Unlock Link
                                    </button>
                                </div>
                            </form>
                        </div>
                        <script>
                            const form = document.getElementById('passwordForm');
                            const errorMessage = document.getElementById('errorMessage');
                            const submitButton = document.getElementById('submitButton');
                            form.addEventListener('submit', async (e) => {
                                e.preventDefault();
                                errorMessage.style.display = 'none';
                                submitButton.disabled = true;
                                submitButton.textContent = 'Verifying...';
                                const password = e.target.password.value;
                                const shortCode = window.location.pathname.split('/').pop();
                                try {
                                    const response = await fetch('/api/url/check-protected-link/' + shortCode, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ password: password }),
                                    });
                                    const data = await response.json();
                                    if (response.ok) {
                                        window.location.href = data.fullUrl;
                                    } else {
                                        errorMessage.textContent = data.message || 'Invalid password.';
                                        errorMessage.style.display = 'block';
                                    }
                                } catch (error) {
                                    errorMessage.textContent = 'An error occurred.';
                                    errorMessage.style.display = 'block';
                                } finally {
                                    submitButton.disabled = false;
                                    submitButton.textContent = 'Unlock Link';
                                }
                            });
                        </script>
                    </body>
                    </html> 
                `);
            }

            const isPasswordCorrect = await bcrypt.compare(password, urlEntry.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Invalid password.' });
            }
            
            return res.status(200).json({ success: true, fullUrl: urlEntry.full_url });
        }

        return res.redirect(urlEntry.full_url);
        
    } catch (error) {
        next(error);
    }
};

export const getUserLinks = async (req, res, next) => {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.search || '';
        const type = req.query.type || 'All Types';

        let query = { user: userId, isActive: true };

        if (searchTerm) {
            query.$or = [
                { full_url: { $regex: searchTerm, $options: 'i' } },
                { short_url: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (type !== 'All Types') {
            let typeConditions = [{ type: type }]; 

            switch (type) {
                case 'standard':
                    typeConditions.push({
                        type: { $exists: false }, 
                        password: { $exists: false }, 
                        expiresAt: { $exists: false }, 
                        geo_rules: { $size: 0 } 
                    });
                    break;
                case 'protected':
                    typeConditions.push({
                        type: { $exists: false },
                        password: { $exists: true, $ne: null } 
                    });
                    break;
                case 'fire':
                    typeConditions.push({
                        type: { $exists: false },
                        expiresAt: { $exists: true, $ne: null } 
                    });
                    break;
                case 'location':
                    typeConditions.push({
                        type: { $exists: false }, 
                        geo_rules: { $exists: true, $ne: [] } 
                    });
                    break;
                case 'custom':
                    break;
            }

            query = {
                user: userId,
                isActive: true,
                $and: [
                    { $or: typeConditions } 
                ]
            };
            if (searchTerm) {
                query.$and.push({
                    $or: [ 
                        { full_url: { $regex: searchTerm, $options: 'i' } },
                        { short_url: { $regex: searchTerm, $options: 'i' } }
                    ]
                });
            }
        } else { 
            let allTypesConditions = [
                { type: { $exists: false } },
                { type: 'standard' },
                { type: 'custom' },
                { type: 'protected' },
                { type: 'fire' },
                { type: 'location' }
            ];

            query = {
                user: userId,
                isActive: true,
                $and: [
                    { $or: allTypesConditions }
                ]
            };
            if (searchTerm) {
                query.$and.push({
                    $or: [ 
                        { full_url: { $regex: searchTerm, $options: 'i' } },
                        { short_url: { $regex: searchTerm, $options: 'i' } }
                    ]
                });
            }
        }

        const userUrls = await ShortUrl.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalUrls = await ShortUrl.countDocuments(query);
        const totalPages = Math.ceil(totalUrls / limit);

        res.status(200).json({
            urls: userUrls,
            totalPages,
            currentPage: page
        });

    } catch (error) {
        next(error);
    }
};

export const generateQrCode = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required to generate QR code.' });
    }

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H', 
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000FF', 
                light: '#FFFFFFFF' 
            }
        });

        res.status(200).json({ qrCodeDataUrl });

    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ message: 'Failed to generate QR code.', error: error.message });
    }
};

export const deleteShortUrl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user._id : null;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to delete URLs.' });
        }

        const urlEntry = await ShortUrl.findOneAndDelete({
            _id: id,
            user: userId
        });

        if (!urlEntry) {
            return res.status(404).json({ message: 'Short URL not found or you do not have permission to delete it.' });
        }
        res.status(200).json({ message: 'Short URL deleted successfully.', urlEntry });
    } catch (error) {
        next(error);
    }
};

export const getAnalyticsSummary = async (req, res, next) => {
    try {
        const userId = req.user ? req.user._id : null;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        const totalLinks = await ShortUrl.countDocuments({ user: userId });
        const activeLinks = await ShortUrl.countDocuments({ user: userId, isActive: true });

        const clicksAggregation = await ShortUrl.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, totalClicks: { $sum: "$clicks" } } }
        ]);
        const totalClicks = clicksAggregation.length > 0 ? clicksAggregation[0].totalClicks : 0;

        const topCountriesAggregation = await ShortUrl.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$clickDetails" },
            { $group: { _id: "$clickDetails.country", clicks: { $sum: 1 } } },
            { $sort: { clicks: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, name: "$_id", clicks: "$clicks" } }
        ]);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const clicksOverTimeAggregation = await ShortUrl.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$clickDetails" },
            { $match: { "clickDetails.timestamp": { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$clickDetails.timestamp" } },
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, name: "$_id", clicks: "$clicks" } }
        ]);

        res.status(200).json({
            totalLinks,
            activeLinks,
            totalClicks,
            averageClicksPerLink: totalLinks > 0 ? (totalClicks / totalLinks).toFixed(2) : 0,
            topCountries: topCountriesAggregation,
            clicksOverTime: clicksOverTimeAggregation,
        });

    } catch (error) {
        next(error);
    }
};