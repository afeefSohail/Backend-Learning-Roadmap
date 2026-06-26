
DROP TABLE IF EXISTS basics.products_basic;

CREATE TABLE basics.products_basic (

    id SERIAL PRIMARY KEY,

    -- string -> max length of 100 chars
    name VARCHAR(100) NOT NULL,

    description TEXT,

    stock INTEGER DEFAULT 0,

    -- store larger whole number than INTEGER
    total_views BIGINT DEFAULT 0,

    -- exact decimal values
    -- 10 means total digits
    -- 2 means digits after the decimal point, 9999999999.99
    price NUMERIC(10, 2),

    is_active BOOLEAN DEFAULT true
);

-- insert query
INSERT INTO basics.products_basic
    (name, description, stock, total_views, price, is_active)
VALUES 
    ('product 1', 'product 1 desc', 100, 1200, 2455.65, true),
    ('product 2', 'product 2 desc', 200, 1500, 3600.55, true),
    ('product 3', 'product 3 desc', 0, 1800, 2800.78, false);

-- query for products table 
SELECT * FROM basics.products_basic;

-- query for conditional products
SELECT id, name, price, is_active
FROM basics.products_basic
WHERE is_active;

-- command to  run this file => psql -U afeefsohail -d postgresql_basics_01 -f 04-data-types.sql
-- command run to DB => psql -U afeefsohail -d postgresql_basics_01 
-- query for products table => SELECT * FROM basics.products_basic;
