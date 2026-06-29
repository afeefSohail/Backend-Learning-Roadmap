CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS post_tags;

DROP TABLE if EXISTS comments;

DROP TABLE if EXISTS posts;

DROP TABLE if EXISTS tags;

DROP TABLE if EXISTS users;

CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name TEXT NOT NULL
    );

CREATE TABLE
    posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id),
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0)
    );

CREATE TABLE
    comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        post_id UUID NOT NULL REFERENCES posts (id),
        body TEXT NOT NULL
    );

CREATE TABLE
    tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name TEXT NOT NULL UNIQUE
    );

CREATE TABLE
    post_tags (
        post_id UUID NOT NULL REFERENCES posts (id),
        tag_id UUID NOT NULL REFERENCES tags (id),
        -- Composite Primary Key
        -- Connects the two columns into a single Composite Primary Key
        -- One Post can have multiple Tags (e.g., #nature, #travel, #tech).
        -- One Tag can belong to thousands of different Posts.
        -- Many-to-Many relationship
        -- INSERT (post_id: 10, tag_id: 5) ➔ ✅ Allowed (Post 10 gets Tag 5)
        -- INSERT (post_id: 10, tag_id: 8) ➔ ✅ Allowed (Post 10 gets Tag 8)
        -- INSERT (post_id: 11, tag_id: 9) ➔ ✅ Allowed (Post 11 gets Tag 9)
        PRIMARY KEY (post_id, tag_id)
    );

INSERT INTO
    users (name)
VALUES
    ('Izhaan'),
    ('Arham');

INSERT INTO
    posts (user_id, title, status, views)
SELECT
    id,
    'PostgreSQL Joins Explained',
    'published',
    100
FROM
    users
WHERE
    name = 'Izhaan';

INSERT INTO
    posts (user_id, title, status, views)
SELECT
    id,
    'Indexes for Beginners',
    'draft',
    40
FROM
    users
WHERE
    name = 'Izhaan';

INSERT INTO
    posts (user_id, title, status, views)
SELECT
    id,
    'Backend APIs with PostgreSQL',
    'published',
    180
FROM
    users
WHERE
    name = 'Arham';

INSERT INTO
    comments (post_id, body)
SELECT
    id,
    'Very clear explanation.'
FROM
    posts
WHERE
    title = 'PostgreSQL Joins Explained';

INSERT INTO
    comments (post_id, body)
SELECT
    id,
    'Please add more examples.'
FROM
    posts
WHERE
    title = 'Backend APIs with PostgreSQL';

INSERT INTO
    tags (name)
VALUES
    ('sql'),
    ('backend');

INSERT INTO
    post_tags (post_id, tag_id)
SELECT
    p.id,
    t.id
FROM
    posts p,
    tags t
WHERE
    p.title = 'PostgreSQL Joins Explained'
    AND t.name = 'sql';

INSERT INTO
    post_tags (post_id, tag_id)
SELECT
    p.id,
    t.id
FROM
    posts p,
    tags t
WHERE
    p.title = 'Indexes for Beginners'
    AND t.name = 'sql';

INSERT INTO
    post_tags (post_id, tag_id)
SELECT
    p.id,
    t.id
FROM
    posts p,
    tags t
WHERE
    p.title = 'Backend APIs with PostgreSQL'
    AND t.name = 'backend';

SELECT
    'Part 3 reduced database reset and sample data inserted successfully.' AS message;