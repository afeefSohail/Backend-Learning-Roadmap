DROP TABLE IF EXISTS basics.app_events;

CREATE TABLE basics.app_events (

    -- UUID
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_name TEXT NOT NULL,

    -- JSONB (JSON in Binnary formate)
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP DEFAULT NOW()
);

-- command to  run this file => psql -U afeefsohail -d postgresql_basics_01 -f 05-other-data-types.sql
-- command run to DB => psql -U afeefsohail -d postgresql_basics_01 
-- to see List of  Tables => \dt basics.*

-- insert query
INSERT INTO basics.app_events (event_name, metadata)

VALUES 
(
    'sign_up',
    '{"browser": "chrome"}'
),
(
    'sign_in',
    '{"user": "afeef sohail"}'
);

-- get table data query
-- SELECT * FROM basics.app_events;

-- get table data query with fixed comma
SELECT
    event_name,
    metadata ->> 'browser' AS browser    
FROM basics.app_events
WHERE metadata ? 'browser';

