import { Router } from 'express';
import {
  // Regiones
  listRegions,
  getRegion,
  addRegion,
  updateRegion,
  deleteRegion,

  // Pokémon
  listByRegion,
  getOneByRegionAndId,
  addPokemon,
  updatePokemon,
  deletePokemon,
} from '../controllers/pokedex.controller.js';

const router = Router();

/* ===========================
   RUTAS DE REGIONES
   =========================== */

// Listar todas las regiones
router.get('/regions', listRegions);

// Obtener una región por id
router.get('/regions/:id', getRegion);

// Crear una región nueva
router.post('/regions', addRegion);

// Actualizar una región
router.put('/regions/:id', updateRegion);

// Eliminar una región
router.delete('/regions/:id', deleteRegion);


/* ===========================
   RUTAS DE POKÉMON POR REGIÓN
   =========================== */

// Listar todos los Pokémon de una región
router.get('/regions/:region/pokemons', listByRegion);

// Obtener un Pokémon específico por región + id
router.get('/regions/:region/pokemons/:id', getOneByRegionAndId);

// Crear un nuevo Pokémon en una región
router.post('/regions/:region/pokemons', addPokemon);

// Actualizar un Pokémon
router.put('/regions/:region/pokemons/:id', updatePokemon);

// Eliminar un Pokémon
router.delete('/regions/:region/pokemons/:id', deletePokemon);

export default router;
