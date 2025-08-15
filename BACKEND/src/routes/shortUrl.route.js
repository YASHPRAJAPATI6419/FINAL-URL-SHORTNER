import express from 'express';
import { createAndShortenUrl, redirectToFullUrl, getUserLinks, deleteShortUrl, createProtectedAndShortenUrl, createLocationBasedLink, getAnalyticsSummary } from '../controller/shortUrl.controller.js';
import { attachUser } from '../utils/attachUser.js';
import QRCode from 'qrcode'; 

const router = express.Router();

router.post('/shorten', attachUser, createAndShortenUrl);
router.post('/protected-shorten', attachUser, createProtectedAndShortenUrl);
router.post('/location-shorten', attachUser, createLocationBasedLink);

router.get('/my-urls', attachUser, getUserLinks);
router.delete('/:id',attachUser,deleteShortUrl);

router.get('/analytics/summary', attachUser, getAnalyticsSummary);


router.post('/generate-qr-code', attachUser, async (req, res) => {
    const { url } = req.body;
    console.log("url is ",url);

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
});

router.get('/:shortCode', redirectToFullUrl); 

router.post('/check-protected-link/:shortCode', redirectToFullUrl);

export default router;
