
// npm install para descargar los paquetes...

// Cargar variables de entorno
require('dotenv').config();

// Librerias
const validation = require('./libs/unalib');
const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Configuración de Auth0
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// Configurar sesión
app.use(session({
  secret: process.env.AUTH0_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: isProduction, // true en producción con HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(authConfig));

// Ruta principal - requiere autenticación
app.get('/', requiresAuth(), function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Ruta para obtener info del usuario (para el frontend)
app.get('/user', requiresAuth(), function(req, res){
  res.json({
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
  });
});

// Middleware para Socket.IO - verificar autenticación
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.user) {
    socket.userId = session.user;
    next();
  } else {
    // Permitir conexión pero registrar que no está autenticado
    console.log('Socket connection from unauthenticated user');
    next();
  }
});

// Escuchar conexión por socket
io.on('connection', function(socket){
  console.log('User connected:', socket.id);
  
  // Si se escucha "chat message"
  socket.on('Evento-Mensaje-Server', function(msg){
    msg = validation.validateMessage(msg);
    // Volvemos a emitir el mismo mensaje
    io.emit('Evento-Mensaje-Server', msg);
  });

  socket.on('disconnect', function(){
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, function(){
  console.log('Server listening on *:' + port);
  console.log('Auth0 configured - Login at: ' + process.env.AUTH0_BASE_URL + '/login');
});
