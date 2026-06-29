

-- left join keeps all rows from the left table
-- if the right table has matching data, postgreSQL includes that
-- if its dont have matching data it returns null for right table data

-- posts -> left table
-- comments -> right table 

-- because not every posts is going to have comments
-- some posts will have 100 comments and some will have 0

SELECT
    posts.title AS post_title,
    comments.body AS comment_body
FROM posts
LEFT JOIN comments
    ON posts.id = comments.post_id
ORDER BY posts.title;   
--           post_title          |       comment_body        
-- ------------------------------+---------------------------
--  Backend APIs with PostgreSQL | Please add more examples.
--  Indexes for Beginners        | 
--  PostgreSQL Joins Explained   | Very clear explanation.
