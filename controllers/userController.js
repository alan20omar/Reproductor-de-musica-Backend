const User = require('../database/models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// GET user
exports.getUser_get = (req, res) => {
    const userId = req.user.userId;
    User.findOne({_id: userId, active: true}, {password: false, active: false})
        .then((user) => {
            res.status(200);
            res.send(user);
        })
        .catch((error) => {
            res.status(500);
            res.end('Usuario no encontrado');
            console.error(error);
        });
};

// POST create a user
exports.createUser_post = (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = {
            name: req.body.name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hash,
        };
        // console.log(newUser)
        User.find({email: newUser.email})
            .then((user)=>{
                console.log(user)
                if (!(user.length>0)){
                    User(newUser).save()
                        .then((newUser) => {
                            // console.log('usuario creado')
                            res.status(201);
                            res.send({ mess: 'Usuario registrado correctamente' });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500);
                            res.end('Ocurrio un error:' + error);
                        });
                }else{
                    res.status(409);
                    res.end('Ya existe un usuario registrado con el correo ' + newUser.email);
                }      
            })
            .catch((error)=>{
                console.error(error);
                res.status(500);
                res.end('Ocurrio un error:' + error);
            });
    });
};

// PATCH user
exports.editUser_patch = (req, res) =>{
    const userId = req.user.userId;
    const userChanges = {
        name: req.body.name,
        last_name: req.body.last_name,
        volume: req.body.volume,
        play_queue: req.body.play_queue,
        actual_index_song: req.body.actual_index_song
    }
    if (userChanges.play_queue){
        userChanges.play_queue = userChanges.play_queue.split(',');
    }
    if (userChanges.play_queue == ''){
        userChanges.play_queue = [];
    }
    // console.log(userChanges)
    User.findOneAndUpdate({ _id: userId, active: true }, { $set: userChanges }, { projection: { active: false, password: false}, returnDocument: 'after', runValidators: true })
        .then((user)=>{
            res.status(200);
            res.send({ mess: 'Usuario actualizado correctamente' });
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
            res.end('Ocurrio un error: ' + error);
        })
};