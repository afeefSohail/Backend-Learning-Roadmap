DROP Table if EXISTS basics.students;

CREATE TABLE
    basics.students (
        -- create an auto increment integger
        -- 1, -> 2, 3 and so on, 4, 5
        -- primary key simply means this colum uniquely identifiers each
        id SERIAL PRIMARY KEY,
        --  text - string data.
        --  not null means this col is required.
        --  postgres is oging to reject of this name value is not present.
        name TEXT NOT NULL,
        -- unique means - no 2 students is going to to have email
        email TEXT NOT NULL UNIQUE,
        age INTEGER CHECK (age >= 18),
        -- TIME STAMP => store date and time formate
        -- default means if u dont give any value to him it will take by-default value
        created_at TIMESTAMP DEFAULT NOW ()
    );

-- commpand to run this file => psql -U afeefsohail -d postgresql_basics_01 -f 03-database-table.sql
-- psql -U afeefsohail -d data_base_name 
-- \dt schema_name.*

INSERT INTO
    basics.students (name, email, age)
VALUES
    ('Afeef Sohail', 'afeef@gmail.com', 32),
    ('Peter Parkar', 'peter@gmail.com', 52),
    ('John', 'john@gmail.com', 24);

-- commpand to run this file => psql -U afeefsohail -d postgresql_basics_01 -f 03-database-table.sql
-- psql -U afeefsohail -d postgresql_basics_01
-- SELECT * FROM basics.students;
