const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Producto = sequelize.define("Producto", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM("objeto", "mascota"),
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marca: {  // Solo para objetos
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  antiguedad: {  // Solo para objetos
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {  // Solo para objetos
    type: DataTypes.STRING,
    allowNull: true,
  },
  medidas: {  // Solo para objetos
    type: DataTypes.STRING,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imagenes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  // Campos para mascotas
  tipoMascota: { // Perro, Gato, etc.
    type: DataTypes.STRING,
    allowNull: true,
  },
  raza: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  edad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tamaño: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qr: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "productos",
  timestamps: true,
});

module.exports = Producto;
