-- Schema
-- running command => psql -U afeefsohail -d postgresql_basics_01 -f 02-database-schema.sql
--- DB -> schema -> table -> rows

-- if not exists is going to be create. Prevent any error if the schema is already created. 
CREATE SCHEMA IF NOT EXISTS basics;

-- 
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- query. you can also right from psql_cli. 
-- I only creating this query for learning purpose.
SELECT schema_name
-- this command is from Sytem View which have info about our db structure 
FROM information_schema.schemata
ORDER BY schema_name;

-- basics: Your custom training folder created by your script to hold course learning tables.
-- information_schema: The system metadata dictionary used by DBeaver to read your table columns and data types.
-- pg_catalog: The database engine room storing built-in functions, data types (INT, TEXT), and core settings.
-- pg_toast: The oversized attic storage where PostgreSQL automatically compresses and hides massive blocks of text.
-- public: The default empty dumping ground where tables go if you do not specify a folder.