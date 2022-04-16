'use strict'
const app = require('./app');
const config = require('config');

// Ejecucion de la apliccación
app.listen(config.get('port'), () => {
    console.log(`server started on port ${config.get('port')}!`);
});