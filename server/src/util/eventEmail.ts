import { generateToken, UnsubscribeType } from '../services/UnsubscribeToken';

export const NotificationContextText = ({
  linkToEvent,
  linkToChapter,
}: {
  linkToEvent: string;
  linkToChapter: string;
}) => {
  return `
  Unsubscribe Options</br>
  - To manage notifications about this event, go to <a href="${linkToEvent}">${linkToEvent}</a>.<br />
  - To manage notifications from this chapter about new events, go to <a href="${linkToChapter}">${linkToChapter}</a>.<br />`;
};

export const getUnsubscribeOptions = ({
  chapterId,
  eventId,
  userId,
}: {
  chapterId: number;
  eventId: number;
  userId: number;
}) => {
  const chapterUnsubscribeToken = generateToken(
    UnsubscribeType.Chapter,
    chapterId,
    userId,
  );
  const eventUnsubscribeToken = generateToken(
    UnsubscribeType.Event,
    eventId,
    userId,
  );
  return NotificationContextText({
    linkToEvent: `${process.env.CLIENT_LOCATION}/unsubscribe?token=${eventUnsubscribeToken}`,
    linkToChapter: `${process.env.CLIENT_LOCATION}/unsubscribe?token=${chapterUnsubscribeToken}`,
  });
};

export const getChapterUnsubscribeToken = ({
  chapterId,
  userId,
}: {
  chapterId: number;
  userId: number;
}) => {
  generateToken(UnsubscribeType.Chapter, chapterId, userId);
};
