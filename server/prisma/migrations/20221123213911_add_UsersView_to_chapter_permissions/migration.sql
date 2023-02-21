INSERT INTO chapter_permissions (name, created_at, updated_at)
VALUES
    ('users-view', NOW(), NOW());

-- Insert users-view into the join table for the administrator role.

INSERT INTO chapter_role_permissions (chapter_role_id, chapter_permissions_id, created_at, updated_at)
VALUES
    ((SELECT id FROM chapter_roles WHERE name = 'administrator'),
    (SELECT id FROM chapter_permissions WHERE name = 'users-view'),
    NOW(),
    NOW());
