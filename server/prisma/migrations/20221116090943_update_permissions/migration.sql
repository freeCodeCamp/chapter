-- Add new instance permission

INSERT INTO instance_permissions (name, created_at, updated_at)
VALUES ('sponsor-view', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add instance permissions, chapter-subscriptions-manage, chapter-join and
-- event-subscriptions-manage, if they don't exist (when testing migration in
-- CI, they won't)

INSERT INTO instance_permissions (name, created_at, updated_at)
VALUES 
    ('chapter-subscriptions-manage', NOW(), NOW()),
    ('chapter-join', NOW(), NOW()),
    ('event-subscriptions-manage', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add instance role owner, if it doesn't exist (it won't in CI)

INSERT INTO instance_roles (name, created_at, updated_at)
VALUES ('owner', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Update existing instance permissions

UPDATE instance_permissions SET name = 'chapter-subscription-manage' WHERE name = 'chapter-subscriptions-manage';
UPDATE instance_permissions SET name = 'sponsor-manage' WHERE name = 'sponsors-manage';
UPDATE instance_permissions SET name = 'event-subscription-manage' WHERE name = 'event-subscriptions-manage';

-- Update existing chapter permissions

UPDATE chapter_permissions SET name = 'event-subscription-manage' WHERE name = 'event-subscriptions-manage';

-- Add new instance permission (sponsor-view) to owner role

INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES (
  (SELECT id FROM instance_roles WHERE name = 'owner'),
  (SELECT id FROM instance_permissions WHERE name = 'sponsor-view'),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Add new instance role (chapter_administrator)

INSERT INTO instance_roles (name, created_at, updated_at)
VALUES ('chapter_administrator', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Add permissions (chapter-join, chapter-subscription-manage, sponsor-view) for new instance role (chapter_administrator)

INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES (
  (SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
  (SELECT id FROM instance_permissions WHERE name = 'chapter-subscription-manage'),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES (
  (SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
  (SELECT id FROM instance_permissions WHERE name = 'chapter-join'),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES (
  (SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
  (SELECT id FROM instance_permissions WHERE name = 'sponsor-view'),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
