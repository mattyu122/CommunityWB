CREATE TABLE test (
    id SERIAL PRIMARY KEY,            -- Auto-incrementing ID
    username VARCHAR(100) NOT NULL,   -- Username field, up to 100 characters, cannot be null
    email VARCHAR(150) NOT NULL,      -- Email field, up to 150 characters, cannot be null
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of creation
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Timestamp of last update
);