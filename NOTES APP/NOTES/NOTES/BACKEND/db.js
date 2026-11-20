import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  password: 'mysecretpassword',
  host: 'localhost',
  port: 5432,
  database: 'notes',
})

export async function getNotes() {
  return await pool.query(
    'SELECT id, title, description, date::text AS date FROM notes ORDER BY id DESC'
  )
}

export async function createNote(note) {
  const res = await pool.query(
    'INSERT INTO notes (title, description, date) VALUES ($1, $2, $3) RETURNING id', [note.title, note.description, note.date])
  return { status: true, data: { ...note, id: res.rows[0].id } }
}

export async function updateNote(id, description) {
  await pool.query('UPDATE notes SET description = $1 WHERE id = $2', [description, id])
}

console.log(getNotes())