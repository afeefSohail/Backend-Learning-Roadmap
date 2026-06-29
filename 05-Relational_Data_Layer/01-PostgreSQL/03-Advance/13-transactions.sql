

-- multipale SQL statements run as one safe unit


-- Scenario 
-- Placing an Order
-- reduce stock of that product
-- creating payment records
-- transfering money
-- creating users records with related profile data


BEGIN; 

UPDATE posts
SET status = 'published'
WHERE title = 'Indexes for Beginners'
    AND status = 'draft';

Update posts
SET views = views + 50
WHERE title = 'Indexes for Beginners';

SELECT
    title, 
    status,
    views
FROM posts
WHERE title = 'Indexes for Beginners';


COMMIT;

-- BEGIN
-- UPDATE 1
--          title         |  status   | views 
-- -----------------------+-----------+-------
--  Indexes for Beginners | published |  2050
-- (1 row)

-- COMMIT