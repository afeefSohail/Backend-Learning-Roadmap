-- Constants => NOT NULL, UNIQUE, DEFAULT, CHECK
-- Write In DB from => app, script, developer

DROP TABLE IF EXISTS basics.accounts;

CREATE TABLE basics.accounts (

    id SERIAL PRIMARY KEY,

    full_name TEXT NOT NULL,

    email  TEXT NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT true,

    age INTEGER CHECK ( age>= 18 ),

    created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO basics.accounts (full_name, email, age)
--VALUES ('afeef sohail', 'afeef.sohail@gmail.com', 18); -- will failed
  VALUES ('afeef sohail', 'afeef.sohail@gmail.com', 20);  

-- bash Commands
-- psql -U afeefsohail -d postgresql_basics_01 -f 07-constants.sql
-- psql -U afeefsohail -d postgresql_basics_01 
-- SELECT * FROM basics.accounts;