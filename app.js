// Modules
const express = require('express');
const nodeid3 = require('node-id3');

// Routes
const indexRouter = require('./routes/index')
const songsRouter = require('./routes/songs');

const app = express();

// Database
const mongoose = require('./database/mongoose');

// CORS - Cross Origin Request Security
// Backend - http://localhost:3000
// Frontend - http://localhost:4200
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/', indexRouter);
app.use('/songs', songsRouter);

let objs = { genre: "Anime" };
nodeid3.update(objs, 'G:/Disco secundario/Todo/Música/Música anime/Beautiful World - Evangelion 3.0-1.0.mp3', function (err, buffer) {
    if (!err) {
        console.log('Actualizado');
        nodeid3.read('G:/Disco secundario/Todo/Música/Música anime/Beautiful World - Evangelion 3.0-1.0.mp3', { include: 'all', noRaw: true }, function (err, tags) {
            delete tags.image.type
            // delete tags.image.mime
            // delete tags.genre
            // delete tags.image
            Song(tags).save()
                .then((newSong) => {
                    console.log(newSong);
                })
                .catch((error) => {
                    console.error(error);
                })
        });
    } else {
        console.log(err)
    }
});

// Ejecucion de la apliccación
app.listen(3000, () => {
    console.log('server started on port 3000!');
});