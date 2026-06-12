import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// Helper for executing parameterized SQL queries
export const query = async (text, params) => {
  return pool.query(text, params);
};

// Verify database connection and schema initialization status
export const verifyDatabaseSetup = async () => {
  // Test connection and catch missing database errors
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error('\n=========================================');
    console.error('✗ Database Connection Failed');
    console.error('=========================================');
    if (err.code === '3D000') {
      console.error(`Error: Database "${pool.options.database || 'flightwatch'}" does not exist.`);
      console.error('Please initialize the database using the SQL scripts.');
    } else {
      console.error(`PostgreSQL Error: ${err.message}`);
    }
    console.error('=========================================\n');
    throw err;
  }

  console.log('✓ PostgreSQL Connected');

  // Verify required database tables exist
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'sightings')
    `);
    
    const existingTables = res.rows.map(row => row.table_name);
    const requiredTables = ['users', 'sightings'];
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.error('\n=========================================');
      console.error('✗ Database Verification Failed');
      console.error('=========================================');
      console.error(`Missing required tables: ${missingTables.join(', ')}`);
      console.error('Please run the schema initialization command to generate them.');
      console.error('=========================================\n');
      throw new Error(`Missing tables: ${missingTables.join(', ')}`);
    }

    console.log('✓ FlightWatch Database Ready');
  } catch (err) {
    throw err;
  }
};

export const getPool = () => pool;
