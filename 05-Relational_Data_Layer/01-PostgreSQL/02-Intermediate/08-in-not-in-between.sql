-- IN -> value must match one item from the list
-- NOT IN -> values must not match any time from the list
-- BETWEEN -> value must be inside a range

-- IN works as Including
SELECT name, category, price
FROM products
WHERE category IN ('stationery', 'furniture');
-- Result: - 
--      name      |  category  |  price   
-- ---------------+------------+----------
--  Office Chair  | furniture  |  7999.00
--  Standing Desk | furniture  | 15999.00
--  Notebook      | stationery |    99.00
--  Gel Pen       | stationery |    25.00


-- NOT IN works as excluding
SELECT name, category, price
FROM products
WHERE category NOT IN ('stationery', 'furniture');

-- Result :- 
--         name         |  category   |   price   
-- ---------------------+-------------+-----------
--  Mechanical Keyboard | electronics |   3499.00
--  Wireless Mouse      | electronics |   1299.00
--  USB-C Cable         | electronics |    399.00
--  Old Monitor         | electronics |   4999.00
--  Laptop Stand        | electronics | 500000.00
--  Laptop Stand        | electronics | 500000.00
--  Laptop Stand 5      | electronics | 500000.00
--  Laptop Stand 6      | electronics | 450000.00
--  Laptop Stand 7      | electronics | 305000.00
--  Laptop Stand 8      | Tech        | 550000.00
--  Laptop Stand 9      | Tech        | 400000.00
--  Laptop Stand 10     | Tech        | 300000.00
--  iPhone 17           | Tech        |    999.99
--  Logitech Mouse      | Tech        |     79.99

SELECT name, price
FROM products
WHERE price BETWEEN 100 AND 2000; -- price >= 100 && price <= 2000
-- -- Result :- 
--       name      |  price  
-- ----------------+---------
--  Wireless Mouse | 1299.00
--  USB-C Cable    |  399.00
--  iPhone 17      |  999.99

SELECT name , category, price, stock
FROM products
WHERE category IN ('electronics', 'stationery') AND price BETWEEN 10 AND 1499;
-- RESULT :- 
--       name      |  category   |  price  | stock 
-- ----------------+-------------+---------+-------
--  Wireless Mouse | electronics | 1299.00 |    40
--  USB-C Cable    | electronics |  399.00 |   120
--  Notebook       | stationery  |   99.00 |   200
--  Gel Pen        | stationery  |   25.00 |   500

