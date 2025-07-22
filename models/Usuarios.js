const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuarios = sequelize.define('Usuarios', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  domicilio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  localidad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  confirmado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tokenConfirmacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  residencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codigoPostal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuarios;
