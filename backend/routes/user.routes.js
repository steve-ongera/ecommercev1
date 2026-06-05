const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put(
  '/profile',
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail()
  ],
  userController.updateProfile
);
router.put('/change-password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], userController.changePassword);
router.delete('/account', userController.deleteAccount);

module.exports = router;