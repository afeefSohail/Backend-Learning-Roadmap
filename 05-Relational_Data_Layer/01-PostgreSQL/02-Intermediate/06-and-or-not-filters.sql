

-- AND -> every condition must be true
-- OR -> at least one condition must be true
-- NOT -> reverse/exclude a condition 

SELECT  name, category, price 
FROM products
WHERE category = 'electronics' AND price > 1300;

-- products where the category is electronic or furniture
SELECT name, category, price
FROM products
WHERE category = 'electronics' OR category = 'Tech';

SELECT name, category
FROM products
WHERE NOT category = 'electronics';


SELECT name, category, price, stock
FROM products
WHERE (category = 'electronics' OR category = 'furniture')
AND stock > 0;


SELECT name, price, stock, is_active
FROM products
WHERE is_active = true;
AND (price < 1000 OR stock >= 100); 

