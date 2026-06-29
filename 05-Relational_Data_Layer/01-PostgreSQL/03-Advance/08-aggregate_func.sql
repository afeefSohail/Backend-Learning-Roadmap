-- calculate one result from many rows
-- COUNT() -> number of rows
-- AVG() -> average value
-- SUM()
-- MIN() -> smallest value
-- MAX() -> Maximum value

-- admin dashboard, reoprts, analytics, admin panels
SELECT 
    COUNT(*) AS total_posts
FROM posts;
-- total_posts 
-- -------------
--            3

SELECT 
    COUNT(*) AS total_posts,
    COUNT(*) FILTER (WHERE posts.status = 'published') AS published_posts
FROM posts;
-- total_posts  | published_posts 
-- -------------+-----------------
--            3 |               2

SELECT 
    COUNT(*) AS total_posts,
    COUNT(*) FILTER (WHERE STATUS = 'published') AS published_posts,
    SUM(views) AS total_views
FROM posts;
--  total_posts | published_posts | total_views 
-- -------------+-----------------+-------------
--            3 |               2 |         320

SELECT 
    COUNT(*) AS total_posts,
    COUNT(*) FILTER (WHERE STATUS = 'published') AS published_posts,
    SUM(views) AS total_views,
    AVG(views) AS average_views
FROM posts;
--  total_posts | published_posts | total_views |    average_views     
-- -------------+-----------------+-------------+----------------------
--            3 |               2 |         320 | 106.6666666666666667

SELECT 
    COUNT(*) AS total_posts,
    COUNT(*) FILTER (WHERE STATUS = 'published') AS published_posts,
    SUM(views) AS total_views,
    AVG(views) AS average_views,
    MIN(views) AS lowest_views,
    MAX(views) AS highest_views
FROM posts;
--  total_posts | published_posts | total_views |    average_views     | lowest_views | highest_views 
-- -------------+-----------------+-------------+----------------------+--------------+---------------
--            3 |               2 |         320 | 106.6666666666666667 |           40 |           180

SELECT 
    posts.title AS post_title,
    posts.status,
    posts.views
    FROM posts
    WHERE posts.views = (SELECT MIN(views) FROM posts);
--      post_title        | status | views 
-- -----------------------+--------+-------
--  Indexes for Beginners | draft  |  40

SELECT 
    posts.title AS post_title,
    posts.status,
    posts.views
FROM posts
ORDER BY views ASC
LIMIT 1;

--      post_title        | status | views 
-- -----------------------+--------+-------
--  Indexes for Beginners | draft  |  40
