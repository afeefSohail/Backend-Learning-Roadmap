

DROP TABLE IF EXISTS basics.sales;

CREATE TABLE basics.sales (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL, 

    price NUMERIC(10, 2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.sales (title, price)
VALUES 
    ('sales 1', 200),
    ('sales 2', 500);

SELECT * FROM basics.accounts;
SELECT * FROM WHERE id = 2;


