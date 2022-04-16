'use strict'
// Modules
const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer();

// Middlewares
const authMiddleware = require('../middlewares/auth-middleware');

// Controllers
const userController = require('../controllers/userController');

// Route /user...
router.get('/', authMiddleware, userController.getUser_get);
router.post('/', upload.none(), userController.createUser_post);
router.patch('/', upload.none(), authMiddleware, userController.editUser_patch);

module.exports = router;