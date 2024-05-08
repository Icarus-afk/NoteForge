import express from 'express';
import { signin, signup, deleteUser, updateUser,  refreshToken, verifyToken } from '../controllers/user.js' //getUserDetails,
import auth from '../middleware/auth.js';
import passwordStrength from '../middleware/passwordStrength.js'
import passport from '../utils/passportConfig.js';

import path from 'path';
import multer from 'multer';


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/verify-token', verifyToken);
router.post('/signin', signin);
router.post('/signup', upload.single('userImage'), passwordStrength, signup);
router.post('/refresh-token', refreshToken);
router.delete('/:id', auth, deleteUser);
router.patch('/:id', upload.single('userImage'), auth, updateUser);
// router.get('/:id', auth, getUserDetails);

// Google authentication routes
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/home.html');
});

export default router;