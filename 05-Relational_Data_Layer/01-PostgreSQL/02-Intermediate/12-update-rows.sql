-- Update Single Row Data --
SELECT name, price, stock, sku
FROM products 
WHERE sku = 'ELEC-KEY-001';

UPDATE products 
SET price = 1199.00, 
    stock = 23
WHERE sku = 'ELEC-KEY-001';

SELECT name, price, stock, sku
FROM products 
WHERE sku = 'ELEC-KEY-001';

-- Result:- 
--         name         |  price  | stock |     sku      
-- ---------------------+---------+-------+--------------
--  Mechanical Keyboard | 3499.00 |    15 | ELEC-KEY-001

-- UPDATE 1

--         name         |  price  | stock |     sku      
-- ---------------------+---------+-------+--------------
--  Mechanical Keyboard | 1199.00 |    23 | ELEC-KEY-001

-- Update Multi Row Data --
SELECT name, category, price, is_active
FROM products
WHERE category = 'stationery';

UPDATE products
SET price = ROUND(price * 1.10, 2)
WHERE category = 'stationery';

SELECT name, category, price, is_active
FROM products
WHERE category = 'stationery';

-- Result:- 
--    name   |  category  | price | is_active 
-- ----------+------------+-------+-----------
--  Notebook | stationery | 99.00 | t
--  Gel Pen  | stationery | 25.00 | t

-- UPDATE 2

--    name   |  category  | price  | is_active 
-- ----------+------------+--------+-----------
--  Notebook | stationery | 108.90 | t
--  Gel Pen  | stationery |  27.50 | t


SELECT name, category, price, is_active
FROM products
WHERE stock = 0;

UPDATE products
SET is_active = False
WHERE stock = 0;

SELECT name, category, price, is_active
FROM products
WHERE stock = 0;

-- Result: - 
--     name     |  category   |  price  | is_active 
-- -------------+-------------+---------+-----------
--  Old Monitor | electronics | 4999.00 | t

-- UPDATE 1

--     name     |  category   |  price  | is_active 
-- -------------+-------------+---------+-----------
--  Old Monitor | electronics | 4999.00 | f

SELECT name, category, stock, is_active
FROM products
WHERE is_active = FALSE;

UPDATE products
SET  stock = 100
WHERE is_active = FALSE;

SELECT name, category, stock, is_active
FROM products
WHERE is_active = FALSE;

-- Result: -
--     name     |  category   | stock | is_active 
-- -------------+-------------+-------+-----------
--  Old Monitor | electronics |     0 | f

-- UPDATE 1
 
--      name     |  category   | stock | is_active 
-- -------------+-------------+-------+-----------
--  Old Monitor | electronics |   100 | f