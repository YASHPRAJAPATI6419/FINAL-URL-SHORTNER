import { generateNanoId } from "../utils/helper.js";
import ShortUrl from "../models/shortUrl.model.js";
import bcrypt from 'bcrypt';

export const createShortUrlEntry = async (fullUrl, customAlias = null, userId = null, expiresAt = null, qrCodeDataUrl = null, type = 'standard') => { // <-- 'type' पैरामीटर जोड़ा गया
    let shortCode;

    try {
        new URL(fullUrl);
    } catch (error) {
        throw new Error('Invalid full URL format.');
    }

    if (expiresAt) {
        const expiryDate = new Date(expiresAt);
        if (isNaN(expiryDate.getTime())) {
            throw new Error('Invalid expiry date format.');
        }
        if (expiryDate <= new Date()) {
            throw new Error('Expiry date must be in the future.');
        }
    }

    if (customAlias) {
        const existingUrl = await ShortUrl.findOne({ short_url: customAlias });
        if (existingUrl) {
            throw new Error('Custom alias is already in use. Please choose another one.');
        }
        shortCode = customAlias;
    } else {
        let isUnique = false;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;

        while (!isUnique && attempts < MAX_ATTEMPTS) {
            shortCode = generateNanoId(7);
            const existingUrl = await ShortUrl.findOne({ short_url: shortCode });
            if (!existingUrl) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Could not generate a unique short URL. Please try again.');
        }
    }

    const newShortUrl = new ShortUrl({
        full_url: fullUrl,
        short_url: shortCode,
        clicks: 0,
        user: userId,
        expiresAt: expiresAt,
        qrCodeDataUrl: qrCodeDataUrl,
        type: type, 
    });

    await newShortUrl.save();
    return newShortUrl;
};

export const createProtectedShortUrlEntry = async (fullUrl, customAlias = null, userId = null, expiresAt = null, qrCodeDataUrl = null, password, type = 'protected') => { // <-- 'type' पैरामीटर जोड़ा गया
    let shortCode;

    try {
        new URL(fullUrl);
    } catch (error) {
        throw new Error('Invalid full URL format.');
    }

    if (customAlias) {
        const existingUrl = await ShortUrl.findOne({ short_url: customAlias });
        if (existingUrl) {
            throw new Error('Custom alias is already in use. Please choose another one.');
        }
        shortCode = customAlias;
    } else {
        let isUnique = false;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;

        while (!isUnique && attempts < MAX_ATTEMPTS) {
            shortCode = generateNanoId(7);
            const existingUrl = await ShortUrl.findOne({ short_url: shortCode });
            if (!existingUrl) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Could not generate a unique short URL. Please try again.');
        }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newShortUrl = new ShortUrl({
        full_url: fullUrl,
        short_url: shortCode,
        clicks: 0,
        user: userId,
        expiresAt: expiresAt,
        qrCodeDataUrl: qrCodeDataUrl,
        password: hashedPassword,
        type: type, 
    });

    await newShortUrl.save();
    return newShortUrl;
};

export const createLocationBasedShortUrlEntry = async (fullUrl, customAlias = null, userId = null, geoRules, defaultGeoUrl = null, qrCodeDataUrl = null, type = 'location') => { // <-- 'type' पैरामीटर जोड़ा गया
    let shortCode;

    try {
        new URL(fullUrl); 
    } catch (error) {
        throw new Error('Invalid full URL format.');
    }
    if (!Array.isArray(geoRules) || geoRules.length === 0) {
        throw new Error('At least one geo-redirection rule is required.');
    }
    for (const rule of geoRules) {
        if (!rule.countryCode || !rule.redirectUrl) {
            throw new Error('Each geo-redirection rule must have a countryCode and redirectUrl.');
        }
        try {
            new URL(rule.redirectUrl);
        } catch (error) {
            throw new Error(`Invalid redirect URL format for country ${rule.countryCode}.`);
        }
    }
    
    if (defaultGeoUrl) {
        try {
            new URL(defaultGeoUrl);
        } catch (error) {
            throw new Error('Invalid default geo URL format.');
        }
    }


    if (customAlias) {
        const existingUrl = await ShortUrl.findOne({ short_url: customAlias });
        if (existingUrl) {
            throw new Error('Custom alias is already in use. Please choose another one.');
        }
        shortCode = customAlias;
    } else {
        let isUnique = false;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;

        while (!isUnique && attempts < MAX_ATTEMPTS) {
            shortCode = generateNanoId(7);
            const existingUrl = await ShortUrl.findOne({ short_url: shortCode });
            if (!existingUrl) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Could not generate a unique short URL. Please try again.');
        }
    }

    const newShortUrl = new ShortUrl({
        full_url: fullUrl,
        short_url: shortCode,
        clicks: 0,
        user: userId,
        qrCodeDataUrl: qrCodeDataUrl,
        geo_rules: geoRules,
        defaultGeoUrl: defaultGeoUrl, 
        type: type,
    });

    await newShortUrl.save();
    return newShortUrl;
};


export const getFullUrlAndIncrementClicks = async (shortCode) => {
    const urlEntry = await ShortUrl.findOne({ short_url: shortCode }).select('+password +geo_rules +defaultGeoUrl');

    if (urlEntry) {
        if (urlEntry.expiresAt && urlEntry.expiresAt <= new Date()) {
            throw new Error('This short URL has expired.');
        }

    }
    return urlEntry;
};

export const getUserShortenedUrls = async (userId) => {
    const userUrls = await ShortUrl.find({
        user: userId, isActive: true
    }).sort({ createdAt: -1 }).select('+password +geo_rules +defaultGeoUrl');
    return userUrls;
};
