import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    const res = await pool.query('SELECT id, name, email, password_hash FROM users');
    console.log('Users in DB:', res.rows);
  } catch (err) {
    console.error('Error running query:', err);
  } finally {
    await pool.end();
  }
}
run();
