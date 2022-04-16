'use strict'
// Modules
const express = require('express');
const jwt = require('jsonwebtoken');

const authMiddleware = express.Router();
authMiddleware.use((req, res, next) => {
    let token = undefined;
    if (req.headers['authorization'])
        token = req.headers['authorization'].split(' ')[1];
    if (token) {
        jwt.verify(token, 'llave maestra', (err, decoded) => {
            if (err) {
                res.status(403);
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(401);
        res.send({ mensaje: 'Token no proveída.' });
    }
});
module.exports = authMiddleware;