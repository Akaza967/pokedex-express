import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pokedexRouter from './routes/pokedex.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔹 Para formularios
app.use(morgan('dev'));

// Ruta raíz
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Bienvenido a la Pokédex API 🧢⚡' });
});

// Rutas de la API
app.use('/api', pokedexRouter);

// Manejo 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores (opcional, por si algo falla en controladores)
app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/api`);
});
