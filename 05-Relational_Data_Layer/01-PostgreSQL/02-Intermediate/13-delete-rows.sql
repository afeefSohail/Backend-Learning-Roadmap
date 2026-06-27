

INSERT INTO products (name , category, price, stock, sku, description)
VALUES ('temp product', 'electronics', 345.45, 45, 'ELEC-TEMP=013',  'temporary product to be deleted');

SELECT name, category, sku
FROM products
WHERE sku = 'ELEC-TEMP=013';

DELETE FROM products
WHERE sku = 'ELEC-TEMP=013';

SELECT name, category, sku
FROM products
WHERE sku = 'ELEC-TEMP=013';

-- INSERT 0 1

--      name     |  category   |      sku      
-- --------------+-------------+---------------
--  temp product | electronics | ELEC-TEMP=013

-- DELETE 1

--  name | category | sku 
-- ------+----------+-----
-- (0 rows)