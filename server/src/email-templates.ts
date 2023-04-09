import { events_venue_type_enum } from '@prisma/client';
import { formatDate } from './util/date';

export const SPACER = `<br />
----------------------------<br />
<br />
`;

export const TBD = 'Undecided/TBD';

export const chapterUnsubscribeText = ({ url }: { url: string }) =>
  `- To stop receiving notifications about new events in this chapter, <a href="${url}">unsubscribe here</a>.`;

export const eventUnsubscribeText = ({ url }: { url: string }) =>
  `- To stop receiving notifications about this event, <a href="${url}">unsubscribe here</a>.`;

export const eventListUnsubscribeText = ({ url }: { url: string }) =>
  `<a href="${url}">Cancel attendance</a>.`;

export const chapterAdminUnsubscribeText = ({ url }: { url: string }) =>
  `<a href="${url}">Unsubscribe from chapter emails</a>`;

export const eventDescriptionText = (
  description: string,
) => `About the event: <br />
${description}${SPACER}`;

export const physicalLocationShortText = (venueName: string | undefined) =>
  `Where: ${venueName || TBD}<br />`;

export const streamingURLText = (streamingURL: string | null) =>
  `Streaming URL: ${streamingURL || TBD}<br />`;

interface PhysicalLocationTextData {
  venue: {
    name: string;
    street_address: string | null;
    city: string;
    region: string;
    postal_code: string;
  } | null;
  venue_id: number | null;
}

export const physicalLocationChangeText = ({
  venue,
  venue_id,
}: PhysicalLocationTextData) => {
  if (!venue_id || !venue) return `Location of event is currently ${TBD}.`;

  // TODO: include a link back to the venue page
  return `The event is now being held at <br />
<br />
- ${venue.name} <br />${
    venue.street_address ? `\n- ${venue.street_address} <br />` : ''
  }
- ${venue.city} <br />
- ${venue.region} <br />
- ${venue.postal_code}`;
};

export const dateChangeText = ({
  ends_at,
  start_at,
}: {
  ends_at: Date;
  start_at: Date;
}) => {
  return `\n- Start: ${formatDate(start_at)}<br />
- End: ${formatDate(ends_at)}`;
};

export const streamingUrlChangeText = ({
  streaming_url,
}: {
  streaming_url?: string | null;
}) => {
  return `Streaming URL: ${streaming_url || TBD}`;
};

export const venueTypeChangeText = ({
  newVenueType,
  oldVenueType,
}: {
  newVenueType: events_venue_type_enum;
  oldVenueType: events_venue_type_enum;
}) => {
  switch (oldVenueType) {
    case events_venue_type_enum.Online:
      switch (newVenueType) {
        case events_venue_type_enum.Physical:
          return 'Event was online-only, but now it will be in-person only. It will no longer be possible to attend online.';
        case events_venue_type_enum.PhysicalAndOnline:
          return 'Event was online-only, but now it will be held also in-person. Online attendees are still welcome.';
      }
      break;
    case events_venue_type_enum.Physical:
      switch (newVenueType) {
        case events_venue_type_enum.Online:
          return 'Event was in-person only, but now it will be online-only. It will no longer be possible to attend in-person.';
        case events_venue_type_enum.PhysicalAndOnline:
          return 'Event was online-only, but now it will be held also in-person. Online attendees are still welcome.';
      }
      break;
    case events_venue_type_enum.PhysicalAndOnline:
      switch (newVenueType) {
        case events_venue_type_enum.Online:
          return 'Event was being held in-person and online, but now it will be online-only. It will no longer be possible to attend in-person. Online attendees are still welcome.';
        case events_venue_type_enum.Physical:
          return 'Event was being held in-person and online, but now it will be in-person only. It will no longer be possible to attend online. In-person attendees are still welcome.';
      }
  }
  return null;
};

interface ChapterRoleChangeData {
  chapterName: string;
  userName: string;
  oldChapterRole: string;
  newChapterRole: string;
}

export const chapterUserRoleChange = ({
  chapterName,
  userName,
  oldChapterRole,
  newChapterRole,
}: ChapterRoleChangeData) => ({
  subject: `Role changed in ${chapterName}`,
  emailText: `Hi ${userName}.<br />
Your role in chapter ${chapterName} has been changed from ${oldChapterRole} to ${newChapterRole}.<br />
`,
});

interface ConfirmAtendeeData {
  eventName: string;
  physicalLocation: string;
  streamingData: string;
  start_at: Date;
  ends_at: Date;
}

export const eventConfirmAtendeeText = ({
  eventName,
  physicalLocation,
  streamingData,
  start_at,
  ends_at,
}: ConfirmAtendeeData) => ({
  subject: 'Your attendance is confirmed',
  emailText: `Your reservation is confirmed. You can attend the event ${eventName}.<br />
<br />
When: ${start_at} to ${ends_at}
<br />${physicalLocation}${streamingData}
<br />`,
});

export const eventAttendeeToWaitlistText = ({
  eventName,
}: {
  eventName: string;
}) => ({
  subject: 'You have been put on the waitlist',
  emailText: `Your attendance status for ${eventName} was changed by the event administrator. You are now on the waitlist.`,
});

export const eventCancelationText = ({
  chapterName,
  chapterURL,
  eventName,
}: {
  chapterName: string;
  chapterURL: string;
  eventName: string;
}) => ({
  subject: `Event ${eventName} is canceled`,
  emailText: `The upcoming event ${eventName} has been canceled.<br />
<br />
View upcoming events for ${chapterName}: <a href='${chapterURL}'>${chapterName} chapter</a>.<br />
You received this email because you Subscribed to ${eventName} Event.<br />`,
});

interface EventInviteData {
  chapterName: string;
  chapterURL: string;
  description: string;
  ends_at: Date;
  eventName: string;
  eventConfirmAttendanceURL: string;
  physicalLocation: string;
  start_at: Date;
  streamingData: string;
}

export const eventInviteText = ({
  chapterName,
  chapterURL,
  description,
  ends_at,
  eventName,
  eventConfirmAttendanceURL,
  physicalLocation,
  start_at,
  streamingData,
}: EventInviteData) => ({
  subject: `Invitation to ${eventName}.`,
  emailText: `Upcoming event for ${chapterName}.<br />
<br />
When: ${start_at} to ${ends_at}
<br />${physicalLocation}${streamingData}
<br />
Go to <a href="${eventConfirmAttendanceURL}">the event page</a> to confirm your attendance.${SPACER}
${description}
View all upcoming events for ${chapterName}: <a href='${chapterURL}'>${chapterName} chapter</a>.<br />
<br />`,
});

export const eventNewAttendeeNotificationText = ({
  eventName,
  userName,
}: {
  eventName: string;
  userName: string;
}) => ({
  subject: `New attendee for ${eventName}`,
  emailText: `User ${userName} is attending.`,
});

interface AttendanceConfirmationData {
  eventName: string;
  googleURL: string;
  outlookURL: string;
  userName: string;
  physicalLocation: string;
  streamingData: string;
  start_at: Date;
  ends_at: Date;
}

export const eventAttendanceConfirmationText = ({
  eventName,
  googleURL,
  outlookURL,
  userName,
  physicalLocation,
  streamingData,
  start_at,
  ends_at,
}: AttendanceConfirmationData) => ({
  subject: `Confirmation of attendance: ${eventName}`,
  emailText: `Hi${userName},<br />
Confirming your attendance of ${eventName}.<br />
<br />
When: ${start_at} to ${ends_at}
<br />${physicalLocation}${streamingData}
<br />
You should receive a calendar invite shortly. If you do not, you can add the event to your calendars by clicking on the links below:<br />
<br />
<a href=${googleURL}>Google</a>
<br />
<a href=${outlookURL}>Outlook</a>`,
});

export const eventWaitlistConfirmationText = ({
  eventName,
  userName,
}: {
  eventName: string;
  userName: string;
}) => ({
  subject: `Added to waitlist: ${eventName}`,
  emailText: `Hi${userName},<br />
You were added to waitlist for ${eventName}.<br />
Once there will be available free spot, you will be moved to attendees. You will receive another email when that happens.`,
});

export const eventAttendanceRequestText = ({
  eventName,
  userName,
}: {
  eventName: string;
  userName: string;
}) => ({
  subject: `Attendance request: ${eventName}`,
  emailText: `Hi${userName},<br />
This is confirmation of your request to attend ${eventName}. Once event administrator will accept your request, you will receive another email.`,
});

export const eventAttendanceCancelationText = ({
  eventName,
  userName,
}: {
  eventName: string;
  userName: string;
}) => ({
  subject: `Cancelation of attendance: ${eventName}`,
  emailText: `Hi${userName},<br />
Your attendance was canceled.`,
});

interface EventUpdateData {
  dateChange: string;
  eventName: string;
  physicalLocationChange: string;
  streamingUrlChange: string;
  venueTypeChange: string;
}

export const eventUpdateText = ({
  dateChange,
  eventName,
  physicalLocationChange,
  streamingUrlChange,
  venueTypeChange,
}: EventUpdateData) => ({
  subject: `Details changed for event ${eventName}`,
  emailText: `Updated venue details<br />\n${venueTypeChange}${physicalLocationChange}${streamingUrlChange}${dateChange}`,
});

export const instanceUserRoleChange = ({
  name,
  newRole,
}: {
  name: string;
  newRole: string;
}) => ({
  subject: `Instance role changed`,
  emailText: `Hello, ${name}.<br />
Your instance role has been changed to ${newRole}.`,
});

export const invalidTokenNotification = () => ({
  subject: 'Token marked as invalid',
  emailText:
    "One of the calendar actions was unsuccessful due to issues with validity of the saved authentication token. It's required to reauthenticate with calendar api in the Calendar dashboard.",
});
