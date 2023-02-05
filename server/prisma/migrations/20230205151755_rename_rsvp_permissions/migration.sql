UPDATE chapter_permissions SET name = 'attendee-attend' WHERE name = 'rsvp';
UPDATE chapter_permissions SET name = 'attendee-delete' WHERE name = 'rsvp-delete';
UPDATE chapter_permissions SET name = 'attendee-confirm' WHERE name = 'rsvp-confirm';

UPDATE instance_permissions SET name = 'attendee-attend' WHERE name = 'rsvp';
UPDATE instance_permissions SET name = 'attendee-delete' WHERE name = 'rsvp-delete';
UPDATE instance_permissions SET name = 'attendee-confirm' WHERE name = 'rsvp-confirm';