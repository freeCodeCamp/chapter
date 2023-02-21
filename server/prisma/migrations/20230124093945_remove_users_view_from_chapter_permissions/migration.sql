-- Reverts
-- server/prisma/migrations/20221123213911_add_UsersView_to_chapter_permissions/migration.sql
-- Rationale: only instance owners should be able to view instance users.
-- Chapter administrators can already view chapter users via the chapter-edit
-- permission.
DELETE FROM
    chapter_role_permissions
WHERE
    chapter_permissions_id = (
        SELECT
            id
        FROM
            chapter_permissions
        WHERE
            name = 'users-view'
    );
    
DELETE FROM chapter_permissions WHERE name = 'users-view';