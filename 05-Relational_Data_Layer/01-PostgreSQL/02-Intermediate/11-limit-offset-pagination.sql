-- LIMIT -> is the maximum number of rows you want to return per page.
-- OFFSET -> is the number of rows you want to skip. This is where your math

SELECT name, price
FROM products
ORDER BY price ASC
LIMIT 5; 

SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 5;


-- practicaly scenario of offset
-- (page - 1) * limit
-- (1 - 1) * 5 -> offset = 0
-- (2 - 1) * 5 -> offset = 5
-- (3 - 1) * 5 -> offset = 10

-- 1 page data
SELECT name, price
FROM products
ORDER BY price ASC
LIMIT 5 OFFSET 0;

-- 2 page data
SELECT name, price
FROM products
ORDER BY price ASC
LIMIT 5 OFFSET 5;

-- 3 page
SELECT name, price
FROM products
ORDER BY price ASC
LIMIT 5 OFFSET 10;