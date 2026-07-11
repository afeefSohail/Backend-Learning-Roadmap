-- null - unkown/missing val
-- empty string - known string val but it contains no characters
-- zero - actual numeric value of 0

DROP TABLE IF EXISTS basics.value_examples;

CREATE TABLE basics.value_examples (
    
    id SERIAL PRIMARY KEY,
    
    nickname TEXT,
    
    bio TEXT,

    score INTEGER
);

INSERT INTO basics.value_examples (nickname, bio, score)
VALUES
    (null, 'learning postreSQL', 10),
    ('', 'learning postreSQL', 20),
    ('afeef', '', 0),
    ('john', null, null);

-- command to run the file => psql -U afeefsohail -d postgresql_basics_01 -f 06-null-empty-string-zero.sql
-- query to see all table data
SELECT * FROM basics.value_examples;
--  id | nickname |        bio         | score 
-- ----+----------+--------------------+-------
--   1 |          | learning postreSQL |    10
--   2 |          | learning postreSQL |    20
--   3 | afeef    |                    |     0
--   4 | john     |                    |      
-- (4 rows) 


-- run the complete DB => psql -U afeefsohail -d postgresql_basics_01
-- query to see table data where nickname is null
SELECT * FROM basics.value_examples WHERE nickname IS NULL;
--  id | nickname |        bio         | score 
-- ----+----------+--------------------+-------
--   1 |          | learning postreSQL |    10
-- (1 row)


-- run the complete DB => psql -U afeefsohail -d postgresql_basics_01
-- query to see table data where nickname is empty
SELECT * FROM basics.value_examples WHERE nickname = '';


-- run the complete DB => psql -U afeefsohail -d postgresql_basics_01
-- query to see table data where nickname is empty or NUll
SELECT * FROM basics.value_examples
WHERE nickname IS NULL OR nickname = '';


-- 1. Find the unique IDs of the empty profiles
SELECT id, nickname FROM basics.value_examples WHERE nickname IS NULL OR nickname = '';

-- 2. Update ONLY the exact user you want using their unique ID number or UUID
UPDATE basics.value_examples 
SET nickname = 'Peter Parker' 
WHERE id = 2; --OR nickname == 'afeef'; 

SELECT * FROM basics.value_examples ORDER BY id ASC;
-- UPDATE 1
--  id |   nickname   |        bio         | score 
-- ----+--------------+--------------------+-------
--   1 |              | learning postreSQL |    10
--   2 | Peter Parker | learning postreSQL |    20
--   3 | afeef        |                    |     0
--   4 | john         |                    |      


SELECT * FROM basics.value_examples WHERE score = 0;
--  id | nickname | bio | score 
-- ----+----------+-----+-------
--   3 | afeef    |     |     0
-- (1 row)


SELECT * FROM basics.value_examples WHERE nickname IS NOT NULL;
--  id |   nickname   |        bio         | score 
-- ----+--------------+--------------------+-------
--   3 | afeef        |                    |     0
--   4 | john         |                    |      
--   2 | Peter Parker | learning postreSQL |    20
-- (3 rows)
