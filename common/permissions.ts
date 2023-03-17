enum ChapterPermission {
  AttendeeAttend = 'attendee-attend',
  AttendeeDelete = 'attendee-delete',
  AttendeeConfirm = 'attendee-confirm',
  ChapterEdit = 'chapter-edit',
  ChapterBanUser = 'chapter-ban-user',
  EventCreate = 'event-create',
  EventEdit = 'event-edit',
  EventDelete = 'event-delete',
  EventSendInvite = 'event-send-invite',
  EventSubscriptionManage = 'event-subscription-manage',
  VenueCreate = 'venue-create',
  VenueEdit = 'venue-edit',
  VenueDelete = 'venue-delete',
}

enum InstancePermission {
  ChapterCreate = 'chapter-create',
  ChapterJoin = 'chapter-join',
  ChapterDelete = 'chapter-delete',
  ChaptersView = 'chapters-view',
  EventsView = 'events-view',
  VenuesView = 'venues-view',
  ChapterSubscriptionManage = 'chapter-subscription-manage',
  ChapterUserRoleChange = 'chapter-user-role-change',
  SponsorManage = 'sponsor-manage',
  SponsorView = 'sponsor-view',
  UserInstanceRoleChange = 'user-instance-role-change',
  GoogleAuthenticate = 'google-authenticate',
  UsersView = 'users-view',
}

// Ideally this would be a new enum, but TS does not (to my knowledge) support
// that yet.
export const Permission = { ...InstancePermission, ...ChapterPermission };
export type { InstancePermission, ChapterPermission };
