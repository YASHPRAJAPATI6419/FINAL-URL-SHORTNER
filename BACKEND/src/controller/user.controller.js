import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();
        res.status(200).json({
            message: 'Profile updated successfully.',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                gravatar: updatedUser.gravatar
            }
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new passwords are required.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        next(error);
    }
};

export const manageApiKey = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newApiKey = crypto.randomBytes(20).toString('hex');
        user.apiKey = newApiKey;
        
        await user.save();
        res.status(200).json({ message: 'API Key generated successfully.', apiKey: newApiKey });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);
        res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
        res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
        next(error);
    }
};
