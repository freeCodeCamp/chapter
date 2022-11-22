INSERT INTO chapter_permissions (name, created_at, updated_at)
VALUES
    ('chapter-edit', NOW(), NOW()),
    ('chapter-ban-user', NOW(), NOW()),
    ('event-create', NOW(), NOW()),
    ('event-edit', NOW(), NOW()),
    ('event-delete', NOW(), NOW()),
    ('event-send-invite', NOW(), NOW()),
    ('event-subscription-manage', NOW(), NOW()),
    ('rsvp', NOW(), NOW()),
    ('rsvp-delete', NOW(), NOW()),
    ('rsvp-confirm', NOW(), NOW()),
    ('venue-create', NOW(), NOW()),
    ('venue-edit', NOW(), NOW()),
    ('venue-delete', NOW(), NOW());

INSERT INTO instance_permissions (name, created_at, updated_at)
VALUES
    ('chapter-create', NOW(), NOW()),
    ('chapter-join', NOW(), NOW()),
    ('chapter-delete', NOW(), NOW()),
    ('chapter-subscription-manage', NOW(), NOW()),
    ('chapter-user-role-change', NOW(), NOW()),
    ('sponsor-manage', NOW(), NOW()),
    ('sponsor-view', NOW(), NOW()),
    ('user-instance-role-change', NOW(), NOW()),
    ('users-view', NOW(), NOW()),
    ('google-authenticate', NOW(), NOW()),
    ('chapter-edit', NOW(), NOW()),
    ('chapter-ban-user', NOW(), NOW()),
    ('event-create', NOW(), NOW()),
    ('event-edit', NOW(), NOW()),
    ('event-delete', NOW(), NOW()),
    ('event-send-invite', NOW(), NOW()),
    ('event-subscription-manage', NOW(), NOW()),
    ('rsvp', NOW(), NOW()),
    ('rsvp-delete', NOW(), NOW()),
    ('rsvp-confirm', NOW(), NOW()),
    ('venue-create', NOW(), NOW()),
    ('venue-edit', NOW(), NOW()),
    ('venue-delete', NOW(), NOW());
    
INSERT INTO event_roles (name, created_at, updated_at)
VALUES ('member', NOW(), NOW());  
    
INSERT INTO chapter_roles (name, created_at, updated_at)
VALUES
    ('member', NOW(), NOW()),
    ('administrator', NOW(), NOW());
    
INSERT INTO instance_roles (name, created_at, updated_at)
VALUES
    ('member', NOW(), NOW()),
    ('chapter_administrator', NOW(), NOW()),
    ('owner', NOW(), NOW());
    
INSERT INTO rsvp (name, created_at, updated_at)
VALUES
    ('yes', NOW(), NOW()),
    ('no', NOW(), NOW()),
    ('maybe', NOW(), NOW()),
    ('waitlist', NOW(), NOW());
    
-- Insert every instance permission into the join table for the owner
-- role.
INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES 
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-create'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-join'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-delete'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-subscription-manage'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-user-role-change'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'sponsor-manage'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'sponsor-view'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'user-instance-role-change'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'users-view'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'google-authenticate'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-edit'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-ban-user'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'event-create'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'event-edit'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'event-delete'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'event-send-invite'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'event-subscription-manage'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'rsvp'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'rsvp-delete'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'rsvp-confirm'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'venue-create'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'venue-edit'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'owner'),
    (SELECT id FROM instance_permissions WHERE name = 'venue-delete'),
    NOW(),
    NOW());
    
-- Insert chapter-subscription-manage, chapter-join and sponsor-view into the
-- join table for the chapter_administrator role.

INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES 
    ((SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-join'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-subscription-manage'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'chapter_administrator'),
    (SELECT id FROM instance_permissions WHERE name = 'sponsor-view'),
    NOW(),
    NOW());
    
-- Insert chapter-subscription-manage and chapter-join into the
-- join table for the member role.

INSERT INTO instance_role_permissions (instance_role_id, instance_permission_id, created_at, updated_at)
VALUES 
    ((SELECT id FROM instance_roles WHERE name = 'member'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-join'),
    NOW(),
    NOW()),
    ((SELECT id FROM instance_roles WHERE name = 'member'),
    (SELECT id FROM instance_permissions WHERE name = 'chapter-subscription-manage'),
    NOW(),
    NOW());
    
-- Insert all chapter permissions into the join table for the administrator role.

INSERT INTO chapter_role_permissions (chapter_role_id, chapter_permissions_id, created_at, updated_at)
VALUES
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'chapter-edit'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'chapter-ban-user'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'event-create'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'event-edit'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'event-delete'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'event-send-invite'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'event-subscription-manage'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'rsvp'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'rsvp-delete'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'rsvp-confirm'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'venue-create'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'venue-edit'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'venue-delete'),
    NOW(),
    NOW());
    
-- Insert event-subscription-manage and rsvp into the join table for the member
-- role.

INSERT INTO chapter_role_permissions (chapter_role_id, chapter_permissions_id, created_at, updated_at)
VALUES 
    ((SELECT id FROM chapter_roles WHERE name = 'member'),
    (SELECT id FROM chapter_permissions WHERE name = 'event-subscription-manage'),
    NOW(),
    NOW()),
    ((SELECT id FROM chapter_roles WHERE name = 'member'),
    (SELECT id FROM chapter_permissions WHERE name = 'rsvp'),
    NOW(),
    NOW());