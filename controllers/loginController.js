const User = require('../database/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// POST login a user
exports.loginUser_post = (req, res) => {
    // console.log(req.body,'login')
    User.findOne({email: req.body.email},{password: true})
        .then((user) => {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (err){
                    res.status(500);
                    res.send('Ocurrio un error. Intentelo más tarde');
                }
                if (result){
                    const payload = {
                        userName: user.name,
                        userId: user._id,
                    };
                    const token = jwt.sign(payload, 'llave maestra', {
                        expiresIn: '5 days'
                    });
                    res.status(200);
                    res.send({
                        message: 'Autenticación correcta',
                        token: token
                    });
                } else {
                    res.status(500);
                    res.end("Contraseña incorrecta");
                }
            });
            
        })
        .catch((error) => {
            res.status(500);
            res.end("Usuario no registrado");
        });
};