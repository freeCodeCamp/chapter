import { generateToken, UnsubscribeType } from '../services/UnsubscribeToken';

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
  return `
  Unsubscribe Options</br>
  - To manage notifications about this event, go to <a href="${eventUnsubscribeToken}">${eventUnsubscribeToken}</a>.<br />
  - To manage notifications from this chapter about new events, go to <a href="${chapterUnsubscribeToken}">${chapterUnsubscribeToken}</a>.<br />`;
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
