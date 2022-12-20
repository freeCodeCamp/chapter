import { generateToken, UnsubscribeType } from '../services/UnsubscribeToken';

export const getEventUnsubscribeOptions = ({
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
  const linkToEvent = `${process.env.CLIENT_LOCATION}/unsubscribe?token=${eventUnsubscribeToken}`;
  const linkToChapter = `${process.env.CLIENT_LOCATION}/unsubscribe?token=${chapterUnsubscribeToken}`;
  return `<br />
  - To stop receiving notifications about this event, go to <a href="${linkToEvent}">${linkToEvent}</a>.<br />
  - To stop receiving notifications about new events in this chapter, go to <a href="${linkToChapter}">${linkToChapter}</a>.<br />`;
};

export const getChapterUnsubscribeOptions = ({
  chapterId,
  userId,
}: {
  chapterId: number;
  userId: number;
}) => {
  generateToken(UnsubscribeType.Chapter, chapterId, userId);
};
