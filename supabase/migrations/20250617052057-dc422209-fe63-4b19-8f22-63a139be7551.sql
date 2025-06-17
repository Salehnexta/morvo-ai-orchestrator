
-- Update token quota for saleh@nexta.sa to 20,000 tokens
UPDATE clients 
SET quota_limit = 20000,
    quota_used = 0,
    updated_at = NOW()
WHERE user_id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'saleh@nexta.sa'
);

-- Verify the update
SELECT 
    c.id,
    c.name,
    c.quota_limit,
    c.quota_used,
    u.email
FROM clients c
JOIN auth.users u ON c.user_id = u.id
WHERE u.email = 'saleh@nexta.sa';
