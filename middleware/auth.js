const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next) {
  // Obtener el token del header
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader);

  // Verificar si no hay token
  if (!authHeader) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Extraer el token (eliminar 'Bearer ' si existe)
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    console.log('Token procesado:', token);

    // Verificar el token
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Token decodificado:', decoded);
    
    // Agregar el usuario al objeto de solicitud
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error en autenticación:', err);
    res.status(401).json({ msg: 'Token no válido' });
  }
};
