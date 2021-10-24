const mongoose = require('mongoose');
require('./config/config');

mongoose.connect(process.env.CONEXION,{
    useNewUrlParser: true,
})
.then(db => console.log(`DB is connected`))
.catch(err => console.log(`Ocurrio el siguiente error: ${err}`))
