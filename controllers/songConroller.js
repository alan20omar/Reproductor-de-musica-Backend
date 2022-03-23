const nodeid3 = require('node-id3');
const fs = require('fs');
const path = require('path').resolve(__dirname, '..');

const Song = require('../database/models/song');
const Genre = require('../database/models/genre');

// GET data of all songs availables
exports.availableDataSongList_get = (req, res) => {
    const userId = req.user.userId;
    Song.find({available: true, user: userId}, {available: false, user: false, image: false})
        .then((songs) => {
            res.status(200);
            res.send(songs);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
            res.end('Ocurrio un error: ' + error);
        });
};

// GET data of one song by id
exports.songData_get = (req, res) => {
    const userId = req.user.userId;
    Song.findOne({ _id: req.params.id, available: true, user: userId }, { available: false, user: false, image: false })
        .then((song) => {
            res.status(200);
            res.send(song);
        })
        .catch((error) =>{
            res.status(500);
            console.log(error);
            res.end('Ocurrio un error: ' + error);
        });
};

// GET image of one song by id
exports.songImage_get = (req, res) => {
    const userId = req.user.userId;
    Song.findOne({ _id: req.params.id, user: userId, available: true }, { image: true, _id: false })
        .then((song) => {
            res.status(200);
            res.send(song);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
            res.end('Ocurrio un error: ' + error);
        });
};

// POST Add new song
exports.createSong_post = (req, res) => {
    const userId = req.user.userId;
    if (req.file){
        nodeid3.read(req.file.buffer, { include: 'all', noRaw: true }, (err, tags) => {
            if (err){
                console.log(err);
                res.status(500);
                res.end('Ocurrio un error a la hora de leer el archivo.');
            }
            Genre.findOne({ key: tags.genre }, { genre: true, _id: false })
                .then((genre) => {
                    if (genre) {
                        tags.genre = genre.genre;
                    }
                    tags.user = userId;
                    // console.log(tags)
                    Song(tags).save()
                        .then((newSong) => {
                            const dir = `media/songs/${userId}`;
                            // Crea la carpeta si no existe
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            // Guardar el archivo en media/songs
                            fs.open(`${dir}/${newSong._id}`, 'w', (err, fd) => {
                                if (err) {
                                    Song.updateOne({ _id: newSong._id }, {$set: {available: false}}).catch((error) => {console.log(error);});
                                    console.error('could not open file: ' + err);
                                }else{
                                    fs.write(fd, req.file.buffer, 0, req.file.buffer.length, null, (err) => {
                                        if (err) {
                                            Song.updateOne({ _id: newSong._id }, {$set: {available: false}}).catch((error) => {console.log(error);});
                                            console.error('could not open file: ' + err);
                                        }else{
                                            fs.close(fd, () => {
                                                console.log('Archivo guardado');
                                            });
                                        }
                                    });
                                }
                            });
                            // no envia la imagen ni el atributo available
                            newSong.image = undefined;
                            newSong.available = undefined;
                            res.status(201);
                            res.send(newSong);
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500);
                            res.end('Ocurrio un error:' + error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500);
                    res.end('Ocurrio un error:' + error);
                });
        });
    }else{
        res.status(500);
        res.end('Ocurrio un error. Se esperaba un archivo (song).');
    }
};

// GET file of one song by id
exports.songFile_get = (req, res) => {
    const userId = req.user.userId;
    const idSong = req.params.id;
    Song.findOne({_id: idSong, user: userId})
        .then((song) => {
            if (song.available){
                res.status(200);
                // res.setHeader('Content-Type', 'audio/mpeg');
                res.sendFile(`${path}/media/songs/${userId}/${song._id}`,(error) => {
                    if (error){
                        console.error(error);
                        res.status(500);
                        res.end('Ocurrio un error3: ' + error);
                    }
                });


                // var filePath = `${path}/media/songs/After Glow - GakkouGurashi!.mp3`;
                // var stat = fs.statSync(filePath);

                // res.writeHead(200, {
                //     'Content-Type': 'audio/mpeg',
                //     'Content-Length': stat.size,
                //     'Content-Disposition': `attachment; filename="After Glow - GakkouGurashi!.mp3"`
                // });

                // var readStream = fs.createReadStream(filePath);
                // // We replaced all the event handlers with a simple call to readStream.pipe()
                // readStream.on('open', function () {
                //     // This just pipes the read stream to the response object (which goes to the client)
                //     readStream.pipe(res);
                // });

                // readStream.on('error', function (err) {
                //     res.end(err);
                // });
            }else{
                res.status(500);
                res.send('No hay un archivo disponible');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
            res.end('Ocurrio un error2: ' + error);
        });
};

// DELETE set attr "avalible" to false of one song and delete the corresponding file
exports.deleteSong_delete = (req, res) => {
    const userId = req.user.userId;
    const idSong = req.params.id;
    // console.log(idSong)
    Song.findOne({ _id: idSong, user: userId, avalible: true })
        .then((song) => {
            if (song.available) {
                fs.access(`${path}/media/songs/${userId}/${idSong}`, fs.constants.R_OK, (error) => {
                    if (error) {
                        console.log(error);
                        res.status(500);
                        res.end('Ocurrio un error: ' + error);
                    }
                    fs.unlink(`${path}/media/songs/${userId}/${idSong}`, (error) => {
                        if (error){
                            console.log(error);
                            res.status(500);
                            res.end('Ocurrio un error: ' + error); 
                        }
                        song.available = false;
                        song.image = undefined;
                        song.save();
                        console.log('song deleted')
                        // No enviar el atributo available
                        song.available = undefined;
                        res.status(200);
                        res.send(song);
                    });
                });
            } else {
                res.status(204);
                res.send('No se encontro un registro con la id enviada');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
            res.end('Ocurrio un error2: ' + error);
        });
};

// exports.prueba = (req, res) => {
//     console.log(req.body)
//     res.status(200)
//     res.send('aaaa')
// };

// PATCH data of one song by id
exports.updateSong_patch = (req, res) => {
    // console.log(req.body)
    const userId = req.user.userId;
    const idSong = req.params.id;
    const image = {};
    const songChanges = {
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        trackNumber: req.body.trackNumber,
        favorite: req.body.favorite
    };
    if (req.file){
        if (req.file.size/1024/1024>2){
            res.status(500);
            res.end('Ocurrio un error. El tamaño de la imagen es mayor a 2MB.');
        }
        image.mime = req.file.mimetype;
        image.imageBuffer = req.file.buffer;
        songChanges.image = image;
    }
    console.log('updated')
    Song.findOneAndUpdate({ _id: idSong, user: userId, available: true }, { $set: songChanges }, { projection: { available: false, image: false }, returnDocument: 'after',  runValidators: true } )
        .then((song) => {
            res.status(200);
            res.send(song);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
            res.end('Ocurrio un error: ' + error);
        });
};