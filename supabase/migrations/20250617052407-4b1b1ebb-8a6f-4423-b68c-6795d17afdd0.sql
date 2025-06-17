
-- Check current token status for all users
SELECT 
    c.id,
    c.name,
    c.quota_limit,
    c.quota_used,
    c.active,
    u.email,
    c.created_at
FROM clients c
LEFT JOIN auth.users u ON c.user_id = u.id
ORDER BY c.created_at DESC;

-- Check if there are any active subscriptions
SELECT 
    us.id,
    us.client_id,
    us.status,
    sp.plan_name,
    sp.limits,
    c.quota_limit,
    c.quota_used,
    u.email
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
JOIN clients c ON us.client_id = c.id
LEFT JOIN auth.users u ON c.user_id = u.id
WHERE us.status = 'active'
ORDER BY us.created_at DESC;

-- Update all clients to have proper token limits (20000 for all users)
UPDATE clients 
SET quota_limit = 20000,
    quota_used = 0,
    updated_at = NOW()
WHERE quota_limit < 20000 OR quota_used > 0;
