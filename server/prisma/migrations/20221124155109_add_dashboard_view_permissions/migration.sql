INSERT INTO instance_permissions (name, created_at, updated_at)
VALUES
    ('chapters-view', NOW(), NOW()),
    ('events-view', NOW(), NOW()),
    ('venues-view', NOW(), NOW());

-- Insert new permission into the join table for the owner and chapter_administrator roles.

INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapters-view'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'events-view'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'venues-view'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
    (SELECT id FROM instance_permissions WHERE name = 'chapters-view'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
    (SELECT id FROM instance_permissions WHERE name = 'events-view'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
    (SELECT id FROM instance_permissions WHERE name = 'venues-view'),
    NOW(),
    NOW());