-- /products?category=electronics
SELECT name, category, price
FROM products
WHERE category = 'electronics';

-- find some products where price is > 1000
SELECT name, price
FROM products
WHERE price > 1000;

-- find products which are not actve
SELECT name, is_active
FROM products
WHERE is_active = FALSE;
