

-- null - missing/unkown value
-- u should not check null using = null
-- IS NULL
-- IS NOT NULL

SELECT name, description 
FROM products
WHERE description IS NULL;
-- Result :- 
--     name     | description 
-- -------------+-------------
--  USB-C Cable | 
--  Gel Pen     | 


SELECT name, description 
FROM products
WHERE description IS NOT NULL;
-- Result :- 
--         name         |               description                
-- ---------------------+------------------------------------------
--  Mechanical Keyboard | RGB keyboard with blue switches
--  Wireless Mouse      | Ergonomic wireless mouse
--  Office Chair        | Comfortable chair for long work sessions
--  Standing Desk       | Height adjustable desk
--  Notebook            | Ruled notebook for daily notes
--  Old Monitor         | Inactive old stock item
--  Laptop Stand        | laptop stand description
--  Laptop Stand        | laptop stand description
--  Laptop Stand 5      | laptop stand 5 description
--  Laptop Stand 6      | laptop stand 6 description
--  Laptop Stand 7      | laptop stand 7 description
--  Laptop Stand 8      | laptop stand 5 description
--  Laptop Stand 9      | laptop stand 6 description
--  Laptop Stand 10     | laptop stand 7 description
--  iPhone 17           | New phone
--  Logitech Mouse      | Wireless mouse

SELECT name, category, is_active, description
FROM products
WHERE is_active = TRUE AND description IS NULL;
-- Result :-
--     name     |  category   | is_active | description 
-- -------------+-------------+-----------+-------------
--  USB-C Cable | electronics | t         | 
--  Gel Pen     | stationery  | t         | 
