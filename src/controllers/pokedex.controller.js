import fs from 'fs';
import path from 'path';
import data from '../data/pokedex.json' with { type: 'json' };

const dataPath = path.resolve('./src/data/pokedex.json');

// 🔹 Guardar cambios en el archivo
const saveData = () => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// 🔹 Normalizar strings (acentos, mayúsculas, etc.)
const normalize = (s) =>
  s
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// ================== REGIONES ==================

// Listar todas las regiones
export const listRegions = (req, res) => {
  res.json(Object.keys(data));
};

// Obtener una región por id
export const getRegion = (req, res) => {
  const region = req.params.id?.toLowerCase();
  if (!data[region]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }
  res.json({ region, pokemons: data[region] });
};

// Crear una nueva región
export const addRegion = (req, res) => {
  const { id } = req.body;
  const region = id?.toLowerCase();

  if (!region) {
    return res.status(400).json({ error: 'Falta el id de la región' });
  }

  if (data[region]) {
    return res.status(400).json({ error: 'La región ya existe' });
  }

  data[region] = [];
  saveData();

  res.status(201).json({
    id: region,
    pokemons: []
  });
};

// Actualizar el nombre de una región (renombrar)
export const updateRegion = (req, res) => {
  const oldId = req.params.id?.toLowerCase();
  const { newId } = req.body;
  const newRegion = newId?.toLowerCase();

  if (!data[oldId]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }
  if (!newRegion) {
    return res.status(400).json({ error: 'Falta el nuevo id de la región' });
  }
  if (data[newRegion]) {
    return res.status(400).json({ error: 'Ya existe una región con ese nombre' });
  }

  // Renombrar la región
  data[newRegion] = data[oldId];
  delete data[oldId];
  saveData();

  res.json({ message: 'Región actualizada', oldId, newId });
};

// Eliminar una región
export const deleteRegion = (req, res) => {
  const region = req.params.id?.toLowerCase();

  if (!data[region]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  const deleted = { region, pokemons: data[region] };
  delete data[region];
  saveData();

  res.json({ message: 'Región eliminada', deleted });
};

// ================== POKÉMON ==================

// Listar todos los pokémon de una región (con filtros por nombre o tipo)
export const listByRegion = (req, res) => {
  const region = req.params.region?.toLowerCase();
  const { name, type } = req.query;

  if (!data[region]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  let result = data[region];

  if (name) {
    const q = normalize(name);
    result = result.filter((p) => normalize(p.nombre).includes(q));
  }

  if (type) {
    const t = normalize(type);
    result = result.filter((p) => (p.tipos || []).some((tp) => normalize(tp) === t));
  }

  res.json(result);
};

// Obtener un pokémon específico por región + id
export const getOneByRegionAndId = (req, res) => {
  const region = req.params.region?.toLowerCase();
  const id = Number(req.params.id);

  if (!data[region]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  const found = data[region].find((p) => p.id === id);
  if (!found) {
    return res.status(404).json({ error: 'Pokémon no encontrado en esta región' });
  }

  res.json(found);
};

// Crear uno o varios Pokémon
export const addPokemon = (req, res) => {
  const region = req.params.region?.toLowerCase();
  const body = req.body; // puede ser un objeto o un array

  if (!data[region]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  // Convertimos en array siempre, así tratamos ambos casos igual
  const pokemons = Array.isArray(body) ? body : [body];
  const nuevos = [];

  for (const poke of pokemons) {
    const { id, nombre, tipos } = poke;

    if (!id || !nombre) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: id, nombre' });
    }

    if (data[region].some((p) => p.id === id)) {
      return res.status(400).json({ error: `Ya existe un Pokémon con el ID ${id} en la región ${region}` });
    }

    const newPokemon = { id, nombre, tipos: tipos || [], region };
    data[region].push(newPokemon);
    nuevos.push(newPokemon);
  }

  // Ordenamos por id para mantener el orden de la Pokédex
  data[region].sort((a, b) => a.id - b.id);

  saveData();

  // Si fue solo uno → devuelvo objeto, si fueron varios → array
  res.status(201).json(Array.isArray(body) ? nuevos : nuevos[0]);
};


// Actualizar un Pokémon
export const updatePokemon = (req, res) => {
  const region = req.params.region?.toLowerCase();
  const id = Number(req.params.id);
  const { nombre, tipos } = req.body;

  if (!data[region]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  const index = data[region].findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pokémon no encontrado' });
  }

  const existing = data[region][index];

  // Construimos el objeto actualizado asegurando la propiedad `region`
  const updated = {
    id: existing.id,
    nombre: nombre ?? existing.nombre,
    tipos: Array.isArray(tipos) ? tipos : existing.tipos,
    region, // siempre incluimos la región (en minúsculas)
  };

  data[region][index] = updated;

  try {
    saveData();
  } catch (err) {
    console.error('Error guardando pokedex.json:', err);
    return res.status(500).json({ error: 'Error interno al guardar el Pokémon' });
  }

  res.json(updated);
};

// Eliminar un Pokémon
export const deletePokemon = (req, res) => {
  const region = req.params.region?.toLowerCase();
  const id = Number(req.params.id);

  if (!data[region]) {
    return res.status(404).json({ error: 'Región no encontrada' });
  }

  const index = data[region].findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pokémon no encontrado' });
  }

  const deleted = data[region].splice(index, 1);
  saveData();

  res.json({ message: 'Pokémon eliminado', deleted: deleted[0] });
};
