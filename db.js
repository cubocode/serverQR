const { Pool } = require('pg');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
