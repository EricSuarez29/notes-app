// ****************************************
// PUERTO
// ****************************************

process.env.PORT = process.env.PORT || 3000;

// ****************************************
// ENTORNO
// ****************************************

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ****************************************
// MONGODB
// ****************************************

let conexion;

if(process.env.NODE_ENV === 'dev'){
    conexion = 'mongodb://localhost/notes-db-app';
} else {
    conexion = process.env.CONEXION;
}

process.env.CONEXION = conexion;
