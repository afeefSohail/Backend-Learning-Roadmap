-- one parent row has many child rows.
-- Example: one User can write many post, 
-- But one post always belongs to one uesr.
-- users - parent table
-- posts - child table
-- posts.user_id -> user.id
-- user.id is the origninal user Id
-- posts.user_id store that original user id inside the posts table
-- show all posts with their authors
SELECT
    users.name AS author_name,
    posts.title AS post_title,
    posts.status
FROM users
    INNER JOIN posts ON users.id = posts.user_id
ORDER BY
    users.name,
    posts.title;

-- Result: -
--  author_name |          post_title          |  status   
-- -------------+------------------------------+-----------
--  Arham       | Backend APIs with PostgreSQL | published
--  Izhaan      | Indexes for Beginners        | draft
--  Izhaan      | PostgreSQL Joins Explained   | published
