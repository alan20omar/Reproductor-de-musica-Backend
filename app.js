'use strict'
// Modules
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Config
const config = require('config');

// Middlewares
const authMiddleware = require('./middlewares/auth-middleware');

// Routers
const indexRouter = require('./routes/index');
const songsRouter = require('./routes/songs');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');

const app = express();

// Database
const mongoose = require('./database/mongoose');

// CORS - Cross-origin resource sharing 
app.use(cors({
    origin: config.get('whiteListCORS'),
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type', 'Accept', 'Authorization'],
}));

// Handling forms middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public files
app.use(express.static('public'));

// Routes
app.use('/', indexRouter);
app.use('/songs', authMiddleware, songsRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);

module.exports = app;