import { generateToken, UnsubscribeType } from '../services/UnsubscribeToken';

const unsubscribeUrlFromToken = (token: string) =>
  `${process.env.CLIENT_LOCATION}/unsubscribe?token=${token}`;

export const chapterUnsubscribeOptions = ({
  chapterId,
  userId,
}: {
  chapterId: number;
  userId: number;
}) => {
  return `<br />
  - To stop receiving notifications about new events in this chapter, <a href="${generateToken(
    UnsubscribeType.Chapter,
    chapterId,
    userId,
  )}">unsubscribe here</a>.`;
};

export const eventUnsubscribeOptions = ({
  chapterId,
  eventId,
  userId,
}: {
  chapterId: number;
  eventId: number;
  userId: number;
}) => {
  const eventUnsubscribeToken = generateToken(
    UnsubscribeType.Event,
    eventId,
    userId,
  );
  const linkForEvent = unsubscribeUrlFromToken(eventUnsubscribeToken);
  const chapterUnsubscribe = chapterUnsubscribeOptions({ chapterId, userId });
  return `<br />
  - To stop receiving notifications about this event, <a href="${linkForEvent}">unsubscribe here</a>.${chapterUnsubscribe}`;
};

export const chapterAdminUnsubscribeOptions = ({
  chapterId,
  userId,
}: {
  chapterId: number;
  userId: number;
}) => {
  const chapterUnsubscribeToken = generateToken(
    UnsubscribeType.Chapter,
    chapterId,
    userId,
  );
  return `<br /><a href="${unsubscribeUrlFromToken(
    chapterUnsubscribeToken,
  )}">Unsubscribe from chapter emails</a>`;
};
