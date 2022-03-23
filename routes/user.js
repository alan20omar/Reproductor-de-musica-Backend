const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
// Controllers
const userController = require('../controllers/userController');

//middleware
const jwt = require('jsonwebtoken');
const rutasProtegidas = express.Router();
rutasProtegidas.use((req, res, next) => {
    let token = undefined;
    if (req.headers['authorization'])
        token = req.headers['authorization'].split(' ')[1];
    // console.log(token)

    if (token) {
        jwt.verify(token, 'llave maestra', (err, decoded) => {
            if (err) {
                res.status(403);
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.user = decoded;
                // console.log(decoded)
                next();
            }
        });
    } else {
        res.status(401);
        res.send({ mensaje: 'Token no proveída.' });
    }
});

// Routes /user...
router.get('/', rutasProtegidas, userController.getUser_get);
router.post('/', upload.none(), userController.createUser_post);
router.patch('/', upload.none(), rutasProtegidas, userController.editUser_patch);

module.exports = router;