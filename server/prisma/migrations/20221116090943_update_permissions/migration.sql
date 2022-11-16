-- Add new instance permission

INSERT INTO instance_permissions (name, created_at, updated_at)
VALUES ('sponsor-view', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Update existing instance permissions

UPDATE instance_permissions SET name = 'chapter-subscription-manage' WHERE name = 'chapter-subscriptions-manage';
UPDATE instance_permissions SET name = 'sponsor-manage' WHERE name = 'sponsors-manage';
UPDATE instance_permissions SET name = 'event-subscription-manage' WHERE name = 'event-subscriptions-manage';

-- Update existing chapter permissions

UPDATE chapter_permissions SET name = 'event-subscription-manage' WHERE name = 'event-subscriptions-manage';

