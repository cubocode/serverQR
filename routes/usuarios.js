const express = require("express");
const router = express.Router();
const { getUsuarios, createUsuario, loginUsuario, confirmarUsuario } = require("../controllers/usuarios");
const multer = require("multer");
const path = require("path");

// Configuración de multer para almacenar la foto de perfil
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Asegúrate de que esta carpeta exista
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // límite de 5MB
  }
});

// Definir rutas
router.get("/", getUsuarios);
router.post("/", upload.single('foto'), createUsuario);
router.post("/login", loginUsuario);
router.get("/confirmar/:token", confirmarUsuario);

module.exports = router;
