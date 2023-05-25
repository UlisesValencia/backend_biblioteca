//Cargando módulos
const express = require('express');
const { Pool } = require('pg');
//Inicializando la aplicación Express y la base de datos PostgreSQL
const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'yrmiddlc',
  host: 'silly.db.elephantsql.com',
  database: 'yrmiddlc',
  password: 'Gu1GJ5pFmHPt3j4bL-0xA_4892QUpKj8',
  port: 5432,
  max: 5, // tamaño máximo del pool
});

//Usuario
//Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener usuarios');
  }
});
//Obtener un usuario específico
app.get('/usuarios/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener usuario');
  }
});
//Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { id, nombre } = req.body;
    const result = await pool.query('INSERT INTO usuarios (id, nombre) VALUES ($1, $2) RETURNING *', [id, nombre]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear usuario');
  }
});
//Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await pool.query('UPDATE usuarios SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar usuario');
  }
});
//Eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al borrar usuario');
  }
});


//Libros
//Obtener todos los libros
app.get('/libros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM libros');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener libros');
  }
});

//Crear un nuevo libro para un usuario
app.post('/usuarios/:id/libros', async (req, res) => {
  try {
    const { titulo, autor, fecha_prestamo } = req.body;
    const result = await pool.query('INSERT INTO libros (titulo, autor, fecha_prestamo, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *', 
    [titulo, autor, fecha_prestamo, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear libro');
  }
});
//Actualizar un libro
app.put('/usuarios/:id/libros/:libroId', async (req, res) => {
  try {
    const { titulo, autor, fecha_prestamo } = req.body;
    const result = await pool.query('UPDATE libros SET titulo = $1, autor = $2, fecha_prestamo = $3 WHERE id = $4 AND usuario_id = $5 RETURNING *', 
    [titulo, autor, fecha_prestamo, req.params.libroId, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar libro');
  }
});
//Eliminar un libro
app.delete('/usuarios/:id/libros/:libroId', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM libros WHERE id = $1 AND usuario_id = $2 RETURNING *', [req.params.libroId, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al borrar libro');
  }
});


//Ruta de inicio
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi API de biblioteca! Autor:Ulises Valencia');
});
//Iniciando el servidor
app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
