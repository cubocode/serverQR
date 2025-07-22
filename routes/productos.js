const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getProductos, createProducto, getProductoById, updateProducto, deleteProducto } = require("../controllers/productos");
const auth = require("../middleware/auth");

// Configuración de multer para almacenar imágenes
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

// Todas las rutas requieren autenticación
router.use(auth);

router.get("/:userId", getProductos);
router.post("/", upload.array('imagenes', 5), createProducto); // Permite hasta 5 imágenes
router.get("/:id", getProductoById);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);

module.exports = router;
