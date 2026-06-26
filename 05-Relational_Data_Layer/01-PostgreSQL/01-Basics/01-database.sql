-- you should never do it in prod app
-- this is only for learning
DROP DATABASE IF EXISTS postgresql_basics_01;

-- create new db inside ur postgre server
CREATE DATABASE postgresql_basics_01;

-- to run this file which is will create you DB => psql -U afeefsohail -d postgres -f 01-database.sql
-- brew install --cask dbeaver-community
-- Login into your DB => psql -U afeefsohail -d postgresql_basics_01
