import express from 'express';
import { updateProfile, changePassword, manageApiKey, deleteAccount } from '../controller/user.controller.js';
import { attachUser } from '../utils/attachUser.js';

const router = express.Router();

router.put('/profile', attachUser, updateProfile);
router.post('/change-password', attachUser, changePassword);
router.post('/api-key', attachUser, manageApiKey);
router.delete('/delete-account', attachUser, deleteAccount);

export default router;
