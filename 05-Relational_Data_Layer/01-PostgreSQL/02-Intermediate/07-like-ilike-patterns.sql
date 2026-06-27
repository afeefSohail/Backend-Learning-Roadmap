-- link - case senstive pattern match
-- ilike - case insentive pattern match
-- % means any number of chars
-- _ exactly one char

-- % means anything can comes after it.
SELECT name, price
FROM products
WHERE name LIKE 'Wireless%';

-- ILIKE (Case Sensitive) DESK , desk, Desk
SELECT name, category, price 
FROM products
WHERE name ILIKE '%desk%';

SELECT name, category, description
FROM products 
WHERE name ILIKE '%chair%';