const sequelize = require('./config/database');
const Usuarios = require('./models/Usuarios');
const Productos = require('./models/Productos');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con éxito.');

    // Sincroniza todos los modelos con la base de datos
    await sequelize.sync({ alter: true }); 
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}

syncDatabase();
