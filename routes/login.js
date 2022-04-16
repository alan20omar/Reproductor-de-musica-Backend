'use strict'
// for parsing multipart/form-data // use upload.single('<file>')
const multer = require('multer');
// const upload = multer({ dest: './media/songs/' }); // Save the file
const upload = multer(); // Read formData upload.none()
const express = require('express');
const router = express.Router();

// Controllers
const loginController = require('../controllers/loginController');

// Routes /login...
router.post('/', upload.none(), loginController.loginUser_post);

module.exports = router;