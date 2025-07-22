const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuarios");
const config = require("../config/config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
  service: "gmail",
  auth: {
    user: "adiazcjc@gmail.com",
    pass: "wgklvixyfuruqize"
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Crear un nuevo usuario
const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, contrasenia, domicilio, pais, provincia, localidad, codigoPostal, telefono } = req.body;
    let foto = null;
    if (req.file) {
      foto = req.file.path.replace(/\\/g, '/');
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);
    const tokenConfirmacion = crypto.randomBytes(32).toString("hex");
    const newUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      contraseña: hashedPassword,
      domicilio,
      pais,
      provincia,
      localidad,
      codigoPostal,
      telefono,
      foto,
      confirmado: false,
      tokenConfirmacion
    });

    // Simular envío de email de confirmación
    const urlConfirmacion = `http://localhost:3001/usuarios/confirmar/${tokenConfirmacion}`;
    console.log(`Enlace de confirmación para ${email}: ${urlConfirmacion}`);

    // Enviar email de confirmación real
    const mailOptions = {
      from: '"Tu App" <adiazcjc@gmail.com>',
      to: email,
      subject: "Confirma tu cuenta",
      html: `
        <h2>¡Bienvenido/a, ${nombre}!</h2>
        <p>Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
        <a href="${urlConfirmacion}">${urlConfirmacion}</a>
        <p>Si no creaste esta cuenta, ignora este correo.</p>
      `
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      msg: "Usuario creado. Revisa tu correo para confirmar tu cuenta.",
      email,
      urlConfirmacion // solo para pruebas, en producción no enviar esto
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Confirmar usuario
const confirmarUsuario = async (req, res) => {
  try {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where: { tokenConfirmacion: token } });
    if (!usuario) {
      return res.status(400).json({ msg: "Token de confirmación inválido" });
    }
    usuario.confirmado = true;
    usuario.tokenConfirmacion = null;
    await usuario.save();
    res.json({ msg: "Cuenta confirmada correctamente. Ya puedes iniciar sesión." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;

    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }
    if (!user.confirmado) {
      return res.status(401).json({ msg: "Debes confirmar tu correo antes de iniciar sesión." });
    }

    const isMatch = await bcrypt.compare(contrasenia, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido
      },
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        domicilio: user.domicilio,
        pais: user.pais,
        provincia: user.provincia,
        localidad: user.localidad,
        codigoPostal: user.codigoPostal,
        telefono: user.telefono,
        foto: user.foto
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

// Exportar los controladores
module.exports = {
  getUsuarios,
  createUsuario,
  loginUsuario,
  confirmarUsuario,
};
