

-- index helps postgres find rows faster

SELECT
    id, 
    title, 
    status
from posts
WHERE status = 'published';

-- idx_posts_status
-- idx -> index
-- posts -> table name
-- status -> column name
CREATE INDEX IF NOT EXISTS idx_posts_status
ON posts(status);


-- Composite Index
SELECT 
    title, 
    status,
    views
FROM posts
WHERE status = 'published'
ORDER BY views DESC; 

-- Composite Index
CREATE INDEX IF EXISTS idx_posts_status_views
ON posts(status, views DESC);

-- /users/:id/posts

SELECT 
    title, 
    status, 
    views
FROM posts
WHERE user_id = (
    SELECT id
    FROM users
    WHERE name = 'Izhaan'
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id
ON posts(user_id)