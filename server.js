const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const usuariosRoutes = require("./routes/usuarios"); 
const productosRoutes = require("./routes/productos"); 

const app = express();

// Crear la carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.71:3000", "http://localhost:3002"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar las rutas de usuarios
app.use("/usuarios", usuariosRoutes);

app.use("/productos", productosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
