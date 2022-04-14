'use strict'
// Modules
const express = require('express');
const jwt = require('jsonwebtoken');
const settings = require('./settings');
// const cors = require('cors');
// const multer = require('multer');
// const upload = multer();

// Routes
const indexRouter = require('./routes/index');
const songsRouter = require('./routes/songs');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');

const app = express();

// Database
const mongoose = require('./database/mongoose');
// const Song = require('./database/models/song');


// CORS - Cross Origin Request Security
// Backend - http://localhost:3000
// Frontend - http://localhost:4200
app.use((req, res, next) => {
    console.log(req.headers.origin)
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://frontend-reproductor.web.app');
    res.setHeader('Access-Control-Allow-Origin', `${req.headers.origin}`);
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }   

    // Pass to next layer of middleware
    next();
});

//middleware
const rutasProtegidas = express.Router();
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    // console.log(token)
    
    if (token) {
        jwt.verify(token, settings.secretKey, (err, decoded) => {
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
// Auth
// app.set('llave', 'llave maestra');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Handling forms middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/songs', rutasProtegidas, songsRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);

// let objs = { genre: "Anime" };
// nodeid3.update(objs, 'G:/Disco secundario/Todo/Música/Música anime/Beautiful World - Evangelion 3.0-1.0.mp3', function (err, buffer) {
//     if (!err) {
//         console.log('Actualizado');
        // nodeid3.read('G:/Disco secundario/Todo/Música/Música anime/Beautiful World - Evangelion 3.0-1.0.mp3', { include: 'all', noRaw: true }, function (err, tags) {
        //     // delete tags.image.type
        //     // delete tags.image.mime
        //     // delete tags.genre
        //     // delete tags.image
        //     Song(tags).save()
        //         .then((newSong) => {
        //             console.log(newSong);
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //         })
        // });
    // } else {
    //     console.log(err)
    // }
// });

// Ejecucion de la apliccación
app.listen(settings.port, () => {
    console.log('server started on port 3000!');
});