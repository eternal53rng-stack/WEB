import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  password: 'mysecretpassword',
  host: 'localhost',
  port: 5432,
  database: 'notes',
})

export async function getNotes() {
    const client = await pool.connect();
    const res = await client.query('SELECT * FROM notes');
    return res
}