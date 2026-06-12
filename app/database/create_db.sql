-- SQL command to safely create database in psql environment if it doesn't exist.
-- To run this, execute:
-- psql -U postgres -d postgres -f create_db.sql

SELECT 'CREATE DATABASE flightwatch'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'flightwatch')\gexec
