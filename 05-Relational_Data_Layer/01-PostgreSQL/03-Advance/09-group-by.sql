-- group by create groups of rows
-- WHERE -> Filters normal rows before grouping 
-- HAVING -> filter groups after grouping

-- find authors who have written atleast 2 posts

SELECT 
    u.name AS auth_name,
    COUNT(p.id) AS total_posts,
    SUM(p.views) AS total_views
FROM users AS u
LEFT JOIN posts AS p
    ON u.id = p.user_id
GROUP BY u.id, u.name -- group those user which have 2 post count
HAVING COUNT(p.id) >= 2
ORDER BY total_posts DESC;
--  auth_name | total_posts | total_views 
-- -----------+-------------+-------------
--  Izhaan    |           2 |         140
