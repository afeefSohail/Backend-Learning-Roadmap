

-- alaises is going to make ur queries shorter and easier to read
-- posts.title
-- i want to write like this p.title
-- users.name instead u.name

SELECT 
    p.title AS post_title,
    p.status ,
    P.views,
    u.name AS author_name,
    c.body AS comment_body
FROM posts AS p
    INNER JOIN users as u
    ON p.user_id = u.id
    LEFT JOIN comments AS c
    ON p.id = c.post_id
ORDER BY p.views DESC;
--           post_title          |  status   | views | author_name |       comment_body        
-- ------------------------------+-----------+-------+-------------+---------------------------
--  Backend APIs with PostgreSQL | published |   180 | Arham       | Please add more examples.
--  PostgreSQL Joins Explained   | published |   100 | Izhaan      | Very clear explanation.
--  Indexes for Beginners        | draft     |    40 | Izhaan      | 
