import * as React from 'react';
import { AddSponsor } from 'client/components';

const AddSponsorPage = () => {
  // TODO - Dynamically get Chapter and EventId s
  const eventId = '123abc';
  const chapterId = 'abc123';

  return (
    <>
      <AddSponsor eventId={eventId} chapterId={chapterId} />
      {
        // TODO: page designs and styling
      }
    </>
  );
};

export default AddSponsorPage;
