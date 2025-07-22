const Producto = require("../models/Productos");
const Usuario = require("../models/Usuarios");

// Obtener todos los productos de un usuario
const getProductos = async (req, res) => {
  try {
    const { userId } = req.params;
    const productos = await Producto.findAll({
      where: { userId: parseInt(userId) }
    });
    
    // Modificar las URLs de las imágenes para incluir la ruta completa
    const productosConImagenes = productos.map(producto => {
      const prod = producto.toJSON();
      if (prod.imagenes && Array.isArray(prod.imagenes)) {
        prod.imagenes = prod.imagenes.map(imagen => 
          `http://localhost:3001/${imagen.replace(/\\/g, '/')}`
        );
      }
      return prod;
    });

    res.json(productosConImagenes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Crear un nuevo producto (objeto o mascota)
const createProducto = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    console.log("Archivos recibidos:", req.files);

    // Procesar las imágenes
    const imagenes = req.files ? req.files.map(file => file.path) : [];

    // Crear el producto sin el QR
    const nuevoProducto = await Producto.create({
      userId: req.body.userId,
      tipo: req.body.tipo,
      nombre: req.body.nombre,
      marca: req.body.tipo === "objeto" ? req.body.marca : null,
      color: req.body.color,
      antiguedad: req.body.tipo === "objeto" ? req.body.antiguedad : null,
      estado: req.body.tipo === "objeto" ? req.body.estado : null,
      medidas: req.body.tipo === "objeto" ? req.body.medidas : null,
      descripcion: req.body.descripcion,
      imagenes: imagenes,
      tipoMascota: req.body.tipo === "mascota" ? req.body.tipoMascota : null,
      raza: req.body.tipo === "mascota" ? req.body.raza : null,
      edad: req.body.tipo === "mascota" ? req.body.edad : null,
      tamaño: req.body.tipo === "mascota" ? req.body.tamaño : null,
      qr: null, // Se actualiza después
    });

    // Generar la URL única del QR (producto)
    const qrUrl = `http://localhost:3000/producto/${nuevoProducto.id}`;
    await nuevoProducto.update({ qr: qrUrl });

    // Convertir el producto a JSON y modificar las URLs de las imágenes
    const productoJSON = nuevoProducto.toJSON();
    if (productoJSON.imagenes && Array.isArray(productoJSON.imagenes)) {
      productoJSON.imagenes = productoJSON.imagenes.map(imagen => 
        `http://localhost:3001/${imagen.replace(/\\/g, '/')}`
      );
    }

    res.status(201).json(productoJSON);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener un solo producto por ID (incluye usuario)
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Obtener el usuario creador
    const usuario = await Usuario.findByPk(producto.userId, {
      attributes: { exclude: ["contrasenia", "tokenConfirmacion", "createdAt", "updatedAt"] }
    });

    // Modificar las URLs de las imágenes
    let productoJSON = producto.toJSON();
    if (productoJSON.imagenes && Array.isArray(productoJSON.imagenes)) {
      productoJSON.imagenes = productoJSON.imagenes.map(imagen => 
        `http://localhost:3001/${imagen.replace(/\\/g, '/')}`
      );
    }

    res.json({ producto: productoJSON, usuario });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, nombre, marca, color, antiguedad, estado, medidas, descripcion, imagenes, tipoMascota, raza, edad, tamaño } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    await producto.update({
      tipo,
      nombre,
      marca: tipo === "objeto" ? marca : null,
      color,
      antiguedad: tipo === "objeto" ? antiguedad : null,
      estado: tipo === "objeto" ? estado : null,
      medidas: tipo === "objeto" ? medidas : null,
      descripcion,
      imagenes,
      tipoMascota: tipo === "mascota" ? tipoMascota : null,
      raza: tipo === "mascota" ? raza : null,
      edad: tipo === "mascota" ? edad : null,
      tamaño: tipo === "mascota" ? tamaño : null,
    });

    res.json({ msg: "Producto actualizado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    await producto.destroy();
    res.json({ msg: "Producto eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

module.exports = {
  getProductos,
  createProducto,
  getProductoById,
  updateProducto,
  deleteProducto,
};
