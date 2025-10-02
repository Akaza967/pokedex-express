
# Pokédex API (Node.js + Express)

API REST sencilla que organiza Pokémon por región: **Kanto, Johto, Hoenn, Sinnoh y Teselia (Unova)**.

## 🚀 Cómo ejecutar

```bash
# 1) Instalar dependencias
npm install

# 2) Arrancar en modo desarrollo (con recarga automática)
npm run dev

# 3) o bien en modo producción
npm start
```

El servidor se levanta por defecto en `http://localhost:3000` (configurable con la variable `PORT`).

## 📡 Endpoints

- `GET /` → Ping.
- `GET /api/regions` → Lista de regiones disponibles.
- `GET /api/:region` → Lista de Pokémon de una región. Filtros opcionales:
  - `?name=<texto>` → por nombre (coincidencia parcial, sin tildes, case-insensitive)
  - `?type=<tipo>` → por tipo (ej: Fuego, Agua, Planta, Eléctrico)
- `GET /api/:region/:id` → Obtiene un Pokémon por su `id` (National Dex).

## 🗂 Estructura

```
pokedex-api/
├── package.json
├── README.md
└── src
    ├── index.js
    ├── controllers
    │   └── pokedex.controller.js
    ├── routes
    │   └── pokedex.routes.js
    └── data
        └── pokedex.json
```

> **Nota:** El dataset incluido es de ejemplo (no exhaustivo). Puedes ampliarlo en `src/data/pokedex.json`.

## 🧪 Ejemplos rápidos

- Todas las regiones  
  `GET http://localhost:3000/api/regions`

- Pokémon de Kanto  
  `GET http://localhost:3000/api/kanto`

- Filtrar por nombre (contiene "char") en Kanto  
  `GET http://localhost:3000/api/kanto?name=char`

- Filtrar por tipo Fuego en Teselia  
  `GET http://localhost:3000/api/teselia?type=Fuego`

- Pokémon específico (por id) en Johto  
  `GET http://localhost:3000/api/johto/155`

## 🧰 Ampliaciones sugeridas
- Paginación (`?page=1&limit=20`).
- Soporte multi-región (`/api?regions=kanto,johto`).
- Más campos (altura, peso, habilidades, evolución, etc.).
- Tests con Jest y Supertest.
- Dockerfile y CI/CD.
