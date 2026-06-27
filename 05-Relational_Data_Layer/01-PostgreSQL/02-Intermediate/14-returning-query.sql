-- return back the the rows immediately after insert

INSERT INTO products (name, category, price, stock, sku, description)
VALUES ('webcam camera', 'Tech', 456.67, 56, 'TECH-WEBCAM-001', 'Ranges from 720p HD up to crisp 4K UHD.' )
RETURNING id, name, category, price, stock, created_at;
-- RESULT :- 
--                   id                  |     name      | category | price  | stock |         created_at         
-- --------------------------------------+---------------+----------+--------+-------+----------------------------
--  2bbee2f0-00ca-4e84-8d6c-61b444e2b46f | webcam camera | Tech     | 456.67 |    56 | 2026-06-27 17:31:28.759507
-- INSERT 0 1

UPDATE products
SET stock = stock * 11
WHERE sku = 'TECH-WEBCAM-001'
RETURNING id, name, stock;
-- RESULT: -
--                   id                  |     name      | stock 
-- --------------------------------------+---------------+-------
--  2bbee2f0-00ca-4e84-8d6c-61b444e2b46f | webcam camera |   616

DELETE FROM products
WHERE sku = 'TECH-WEBCAM-001'
RETURNING id, name, sku;


SELECT id, name, sku
FROM products
WHERE sku = 'TECH-WEBCAM-001';
-- RESULT: - 
--                   id                  |     name      |       sku       
-- --------------------------------------+---------------+-----------------
--  2bbee2f0-00ca-4e84-8d6c-61b444e2b46f | webcam camera | TECH-WEBCAM-001

-- DELETE 1
--  id | name | sku 
-- ----+------+-----

