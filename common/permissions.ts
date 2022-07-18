export enum ChapterPermission {
  ChapterEdit = 'chapter-edit',
  EventCreate = 'event-create',
  EventEdit = 'event-edit',
  EventSubscriptionsManage = 'event-subscriptions-manage',
  Rsvp = 'rsvp',
  RsvpDelete = 'rsvp-delete',
  RsvpConfirm = 'rsvp-confirm',
  VenueCreate = 'venue-create',
  VenueEdit = 'venue-edit',
  VenueDelete = 'venue-delete',
}

export enum InstancePermission {
  ChapterCreate = 'chapter-create',
  ChangeInstanceRole = 'change-instance-role',
  SponsorsManage = 'sponsors-manage',
  ViewUsers = 'view-users',
}

// Ideally this would be a new enum, but TS does not (to my knowledge) support
// that yet.
export const Permission = { ...InstancePermission, ...ChapterPermission };
