import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('Error: DATABASE_URL is not set in backend/.env');
  process.exit(1);
}

// Derive postgres default connection URL to check and create database
const parseDbUrl = (url, targetDb) => {
  try {
    const parsed = new URL(url);
    parsed.pathname = `/${targetDb}`;
    return parsed.toString();
  } catch (err) {
    const parts = url.lastIndexOf('/');
    if (parts === -1) return url;
    return url.substring(0, parts + 1) + targetDb;
  }
};

const postgresDbUrl = parseDbUrl(dbUrl, 'postgres');

const runSetup = async () => {
  console.log('Starting FlightWatch database initialization...');
  
  // Step 1: Create flightwatch Database if it doesn't exist
  const clientPostgres = new pg.Client({ connectionString: postgresDbUrl });
  try {
    await clientPostgres.connect();
    const checkDb = await clientPostgres.query(
      `SELECT 1 FROM pg_database WHERE datname = 'flightwatch'`
    );
    
    if (checkDb.rows.length === 0) {
      console.log('Database "flightwatch" does not exist. Creating...');
      await clientPostgres.query('CREATE DATABASE flightwatch');
      console.log('✓ Database "flightwatch" created successfully.');
    } else {
      console.log('✓ Database "flightwatch" already exists.');
    }
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
    process.exit(1);
  } finally {
    await clientPostgres.end();
  }

  // Step 2: Initialize Schema and Seeds inside flightwatch database
  const clientApp = new pg.Client({ connectionString: dbUrl });
  try {
    await clientApp.connect();
    
    // Read schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Applying database schema...');
    await clientApp.query(schemaSql);
    console.log('✓ Database schema applied.');

    // Read seed.sql
    const seedPath = path.join(__dirname, '../database/seed.sql');
    
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log('Seeding database...');
    await clientApp.query(seedSql);
    console.log('✓ Seed data populated successfully.');
    
    console.log('\n=========================================');
    console.log('✓ Database Setup Complete!');
    console.log('=========================================\n');
  } catch (err) {
    console.error('Error initializing tables/seeds:', err.message);
    process.exit(1);
  } finally {
    await clientApp.end();
  }
};

runSetup();
